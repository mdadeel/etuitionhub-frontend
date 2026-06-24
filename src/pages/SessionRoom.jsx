import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import API_URL from '../config/api';
import api from '../services/api';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function SessionRoom() {
    const { id: bookingId } = useParams();
    const navigate = useNavigate();
    const { user, dbUser } = useAuth();

    const PeerRef = useRef(null);
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const socket = useRef();

    useEffect(() => {
        const verifyBooking = async () => {
            try {
                const userEmail = user?.email || dbUser?.email;
                if (!userEmail) {
                    navigate('/login');
                    return;
                }
                
                const response = await api.get(`/api/bookings/${bookingId}`);
                const booking = response.data;
                
                if (!booking || (booking.studentEmail !== userEmail && booking.tutorEmail !== userEmail)) {
                    navigate('/dashboard');
                    return;
                }
            } catch (error) {
                console.error('Session access error:', error);
                navigate('/dashboard');
            }
        };

        if (bookingId && (user || dbUser)) {
            verifyBooking();
        }
    }, [bookingId, user, dbUser, navigate]);

    function callUser(userToCall, currentStream) {
        const P = PeerRef.current;
        if (!P) return;
        const peer = new P({
            initiator: true,
            trickle: false,
            stream: currentStream
        });

        peer.on('signal', (data) => {
            socket.current.emit('signal', {
                userId: userToCall,
                signal: data,
                room: bookingId
            });
        });

        peer.on('stream', (userStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = userStream;
            }
        });

        socket.current.on('signal', (data) => {
            setCallAccepted(true);
            peer.signal(data.signal);
        });

        connectionRef.current = peer;
    };

    useEffect(() => {


        // No WebRTC on Vercel (serverless, no persistent connections)
        if (API_URL.includes('vercel')) {
            console.log('SessionRoom: WebRTC/Video not available on Vercel');
            return;
        }

        import('simple-peer').then(m => { PeerRef.current = m.default; }).catch(() => {});

        socket.current = io(API_URL, {
            withCredentials: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
            timeout: 5000,
        });

        const s = socket.current;
        const userId = user?.email || dbUser?.email || "anonymous";

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }

            s.emit('join-room', bookingId, userId);

            s.on('user-connected', (newUserId) => {
                // Another user joined, we can initiate a call to them
                callUser(newUserId, currentStream);
            });

            s.on('signal', (data) => {
                // If we receive a signal from another user
                if (!callAccepted) {
                    setReceivingCall(true);
                    setCallerSignal(data.signal);
                }
            });

            s.on('chat-message', (msg) => {
                setMessages(prev => [...prev, msg]);
            });
        });

        return () => {
            if (s) {
                s.off('user-connected');
                s.off('signal');
                s.off('chat-message');
                s.disconnect();
            }
            if (connectionRef.current) connectionRef.current.destroy();
            if (stream) {
                stream.getTracks().forEach(track => {
                    track.stop();
                    track.enabled = false;
                });
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingId, user, dbUser]);



    const answerCall = () => {
        const P = PeerRef.current;
        if (!P) return;
        setCallAccepted(true);
        const peer = new P({
            initiator: false,
            trickle: false,
            stream: stream
        });

        peer.on('signal', (data) => {
            socket.current.emit('signal', {
                signal: data,
                room: bookingId
            });
        });

        peer.on('stream', (userStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = userStream;
            }
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        if (connectionRef.current) connectionRef.current.destroy();
        navigate(-1);
    };

    const toggleMic = () => {
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setMicOn(audioTrack.enabled);
        }
    };

    const toggleVideo = () => {
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setVideoOn(videoTrack.enabled);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim()) {
            const msg = { text: messageInput, sender: 'Me', time: new Date().toLocaleTimeString() };
            socket.current.emit('chat-message', { ...msg, room: bookingId });
            setMessageInput('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
            {/* Main Video Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
                {callAccepted && !callEnded ? (
                    <video playsInline ref={userVideo} autoPlay className="size-full max-h-[80vh] object-cover rounded-xl bg-black" />
                ) : (
                    <div className="size-full max-h-[80vh] flex items-center justify-center bg-gray-800 rounded-xl">
                        {receivingCall && !callAccepted ? (
                            <div className="text-center">
                                <h3 className="text-xl mb-4">Someone is joining the session...</h3>
                                <Button onClick={answerCall} className="bg-green-600 hover:bg-green-700">Accept Connection</Button>
                            </div>
                        ) : (
                            <h2 className="text-2xl text-gray-400">Waiting for others to join...</h2>
                        )}
                    </div>
                )}

                {/* My Video (PiP) */}
                {stream && (
                    <div className="absolute bottom-24 right-8 w-48 h-32 bg-black rounded-lg overflow-hidden border-2 border-gray-700 shadow-xl">
                        <video playsInline muted ref={myVideo} autoPlay className="size-full object-cover" />
                    </div>
                )}

                {/* Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-800/80 backdrop-blur-md px-6 py-3 rounded-full">
                    <Button variant="outline" size="icon" className={`rounded-full ${!micOn && 'bg-red-500 text-white border-red-500 hover:bg-red-600'}`} onClick={toggleMic}>
                        {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
                    </Button>
                    <Button variant="outline" size="icon" className={`rounded-full ${!videoOn && 'bg-red-500 text-white border-red-500 hover:bg-red-600'}`} onClick={toggleVideo}>
                        {videoOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
                    </Button>
                    <Button variant="destructive" size="icon" className="rounded-full size-12" onClick={leaveCall}>
                        <PhoneOff className="size-6" />
                    </Button>
                </div>
            </div>

            {/* Chat Sidebar */}
            <div className="w-full md:w-80 bg-gray-800 border-l border-gray-700 flex flex-col h-screen max-h-screen">
                <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                    <MessageSquare className="size-5" />
                    <h3 className="font-medium">Session Chat</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${msg.sender === 'Me' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-700 text-white rounded-tl-sm'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                            <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-700">
                    <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">Send</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
