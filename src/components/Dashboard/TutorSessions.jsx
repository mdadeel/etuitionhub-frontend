import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function TutorSessions() {
    const { dbUser } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (dbUser?.email) {
            api.get(`/api/bookings/tutor/${dbUser.email}`)
                .then(res => setSessions(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [dbUser]);

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">My Sessions</h2>
            {sessions.length === 0 ? (
                <p className="text-muted-foreground">No sessions yet</p>
            ) : (
                <div className="grid gap-4">
                    {sessions.map(session => (
                        <div key={session._id} className="p-4 border rounded-lg">
                            <p className="font-medium">{session.studentEmail}</p>
                            <p className="text-sm text-muted-foreground">
                                {session.meetingDate} at {session.slot}
                            </p>
                            <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                                session.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-muted'
                            }`}>
                                {session.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}