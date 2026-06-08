import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

const LoginRequiredModal = ({ open, onOpenChange, action = "continue" }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-lg font-heading text-foreground">
                        Login Required
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        You need to be logged in to {action}.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-2">
                    <Button asChild className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm">
                        <Link to="/login">
                            <LogIn size={16} className="mr-2" />
                            Sign In
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full h-11 rounded-xl border border-border font-medium text-sm">
                        <Link to="/register">
                            <UserPlus size={16} className="mr-2" />
                            Create Account
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LoginRequiredModal;
