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
                    <Button asChild className="w-full h-11 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-bold uppercase tracking-wider text-xs">
                        <Link to="/login">
                            <LogIn size={14} className="mr-2" />
                            Sign In
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full h-11 rounded-none border-2 border-border font-heading font-bold uppercase tracking-wider text-xs">
                        <Link to="/register">
                            <UserPlus size={14} className="mr-2" />
                            Create Account
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LoginRequiredModal;
