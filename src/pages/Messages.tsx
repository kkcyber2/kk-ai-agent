import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Send, CheckCircle, XCircle, RefreshCw, Bot } from 'lucide-react';

interface Message {
  id: string;
  platform: string;
  account_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  sentiment: string;
  status: string;
  generated_response?: string;
  sent_response?: string;
  created_at: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [customResponse, setCustomResponse] = useState('');
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [filter, setFilter] = useState({
    platform: '',
    status: '',
  });

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.platform) params.append('platform', filter.platform);
      if (filter.status) params.append('status', filter.status);

      const response = await fetch(`/api/messages?${params}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const generateResponse = async (messageId: string) => {
    setGeneratingResponse(true);
    try {
      const response = await fetch(`/api/messages/${messageId}/generate-response`, {
        method: 'POST',
      });
      const data = await response.json();

      // Update the message in the list
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, generated_response: data.response, status: 'pending_approval' }
            : msg
        )
      );
    } catch (error) {
      console.error('Failed to generate response:', error);
    } finally {
      setGeneratingResponse(false);
    }
  };

  const approveResponse = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customResponse }),
      });

      // Update the message status
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, status: 'responded', sent_response: customResponse || msg.generated_response }
            : msg
        )
      );

      setSelectedMessage(null);
      setCustomResponse('');
    } catch (error) {
      console.error('Failed to approve response:', error);
    }
  };

  const rejectMessage = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/reject`, {
        method: 'POST',
      });

      // Update the message status
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status: 'rejected' } : msg
        )
      );
    } catch (error) {
      console.error('Failed to reject message:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'pending_approval': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Button onClick={fetchMessages} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Select value={filter.platform} onValueChange={(value) => setFilter(prev => ({ ...prev, platform: value }))}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filter.status} onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="capitalize">
                    {message.platform}
                  </Badge>
                  <Badge className={getStatusColor(message.status)}>
                    {message.status.replace('_', ' ')}
                  </Badge>
                  <span className={`text-sm font-medium ${getSentimentColor(message.sentiment)}`}>
                    {message.sentiment}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(message.created_at).toLocaleString()}
                </div>
              </div>
              <CardDescription>
                From: {message.sender_name} ({message.sender_id})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{message.content}</p>

              {message.generated_response && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-sm font-medium">AI Generated Response:</span>
                  </div>
                  <p className="text-sm">{message.generated_response}</p>
                </div>
              )}

              {message.sent_response && (
                <div className="mb-4 p-3 bg-green-50 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Sent Response:</span>
                  </div>
                  <p className="text-sm">{message.sent_response}</p>
                </div>
              )}

              <div className="flex space-x-2">
                {message.status === 'pending' && (
                  <Button
                    onClick={() => generateResponse(message.id)}
                    disabled={generatingResponse}
                    variant="outline"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Generate Response
                  </Button>
                )}

                {message.status === 'pending_approval' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedMessage(message)}>
                        <Send className="h-4 w-4 mr-2" />
                        Approve & Send
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Approve Response</DialogTitle>
                        <DialogDescription>
                          Review and optionally edit the response before sending.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Original Message</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {message.content}
                          </p>
                        </div>
                        <div>
                          <Label>Response</Label>
                          <Textarea
                            value={customResponse || message.generated_response || ''}
                            onChange={(e) => setCustomResponse(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                            Cancel
                          </Button>
                          <Button onClick={() => approveResponse(message.id)}>
                            Send Response
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {(message.status === 'pending' || message.status === 'pending_approval') && (
                  <Button
                    onClick={() => rejectMessage(message.id)}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No messages found</p>
        </div>
      )}
    </div>
  );
};

export default Messages;