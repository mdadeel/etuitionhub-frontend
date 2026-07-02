import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import { MessageSquare, Send, Loader2, Inbox, MailOpen } from "lucide-react";
import DataTable from "@/components/ui/data-table";

const OrgMessages = () => {
  const { orgId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/organizations/${orgId}/messages`).catch(() => ({ data: { data: [] } }));
      setMessages(res.data.data || []);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground text-sm mt-1">Internal organization messaging</p>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: "sender",
            label: "From",
            render: (_, msg) => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {msg.senderId?.displayName?.charAt(0) || '?'}
                </div>
                <span className="font-medium text-foreground">{msg.senderId?.displayName || 'System'}</span>
              </div>
            ),
          },
          {
            key: "subject",
            label: "Subject",
            render: (_, msg) => (
              <span className="text-sm text-foreground">{msg.subject || '(no subject)'}</span>
            ),
          },
          {
            key: "createdAt",
            label: "Date",
            render: (_, msg) => (
              <span className="text-xs text-muted-foreground">
                {new Date(msg.createdAt).toLocaleDateString()}
              </span>
            ),
          },
        ]}
        data={messages}
        emptyState={
          <div className="flex flex-col items-center py-12">
            <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No messages yet</p>
          </div>
        }
        rowKey={(m) => m._id}
      />
    </div>
  );
};

export default OrgMessages;
