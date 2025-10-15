import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bug, 
  Lightbulb, 
  ThumbsUp, 
  ThumbsDown,
  Star,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type FeedbackType = 'bug' | 'feature' | 'improvement' | 'compliment' | 'complaint';

const feedbackTypes = {
  bug: { label: 'Bug Report', icon: Bug, color: 'bg-red-100 text-red-700' },
  feature: { label: 'Feature Request', icon: Lightbulb, color: 'bg-blue-100 text-blue-700' },
  improvement: { label: 'Improvement', icon: ThumbsUp, color: 'bg-green-100 text-green-700' },
  compliment: { label: 'Compliment', icon: Star, color: 'bg-yellow-100 text-yellow-700' },
  complaint: { label: 'Complaint', icon: ThumbsDown, color: 'bg-orange-100 text-orange-700' }
};

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('improvement');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedback('');
      setIsOpen(false);
    }, 2000);
  };

  const IconComponent = feedbackTypes[feedbackType].icon;

  return (
    <>
      {/* Floating Feedback Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        size="icon"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="sr-only">Send Feedback</span>
      </Button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Feedback
                  </CardTitle>
                  <CardDescription>
                    Help us improve SCAMS with your suggestions
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {!isSubmitted ? (
                <>
                  {/* Feedback Type */}
                  <div className="space-y-2">
                    <Label>Feedback Type</Label>
                    <Select value={feedbackType} onValueChange={(value: FeedbackType) => setFeedbackType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(feedbackTypes).map(([key, { label, icon: Icon }]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-2" />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Type Badge */}
                  <div className="flex justify-center">
                    <Badge className={feedbackTypes[feedbackType].color}>
                      <IconComponent className="w-3 h-3 mr-1" />
                      {feedbackTypes[feedbackType].label}
                    </Badge>
                  </div>

                  {/* Feedback Text */}
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Your Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder={
                        feedbackType === 'bug' ? 'Describe the bug you encountered...' :
                        feedbackType === 'feature' ? 'Describe the feature you\'d like to see...' :
                        feedbackType === 'improvement' ? 'How can we improve this feature...' :
                        feedbackType === 'compliment' ? 'What did you like about SCAMS...' :
                        'What issues are you experiencing...'
                      }
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* User Info */}
                  <div className="text-xs text-muted-foreground">
                    Feedback from: {user?.name} ({user?.role?.replace('_', ' ')})
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={!feedback.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Feedback
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                /* Success State */
                <div className="text-center py-6">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your feedback has been submitted successfully. We appreciate your input!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
