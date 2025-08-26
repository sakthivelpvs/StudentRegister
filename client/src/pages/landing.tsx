// This landing page is no longer used - users go directly to login
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation("/login");
  }, [setLocation]);
  
  return null;
}
