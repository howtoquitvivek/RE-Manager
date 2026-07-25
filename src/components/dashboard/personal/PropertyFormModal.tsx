"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  FileText, 
  Navigation,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { createPersonalProperty } from "@/actions/personal";
import { useToast } from "@/hooks/use-toast";

interface PropertyFormModalProps {
  userId: string;
  orgId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (property: any) => void;
}

export default function PropertyFormModal({ userId, orgId, isOpen, onClose, onSuccess }: PropertyFormModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    estimatedValue: "",
    address: "",
    propertyType: "House",
    description: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createPersonalProperty({
        userId,
        organizationId: orgId,
        name: formData.name,
        estimatedValue: parseFloat(formData.estimatedValue) || 0,
        address: formData.address,
        description: formData.description,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        status: "ACTIVE",
      });

      toast({
        title: "Property Created",
        description: `${formData.name} has been added to your portfolio.`,
      });
      
      onSuccess(res);
      setFormData({
        name: "",
        estimatedValue: "",
        address: "",
        propertyType: "House",
        description: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card/40 backdrop-blur-2xl border-border/40 rounded-[2rem] p-8 shadow-2xl overflow-hidden">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            New Property
          </DialogTitle>
          <DialogDescription className="text-base">
            Enter the details of your new real estate asset.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Property Name</Label>
              <Input 
                id="name" 
                placeholder="e.g. Sunset Villa" 
                required 
                className="bg-secondary/20 border-border/40 h-11"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Estimated Value ($)</Label>
              <Input 
                id="value" 
                type="number" 
                placeholder="0.00" 
                required 
                className="bg-secondary/20 border-border/40 h-11"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Property Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="address" 
                placeholder="Full address here..." 
                required 
                className="bg-secondary/20 border-border/40 h-11 pl-10"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Property Type</Label>
              <Select 
                value={formData.propertyType} 
                onValueChange={(val) => setFormData({...formData, propertyType: val})}
              >
                <SelectTrigger className="bg-secondary/20 border-border/40 h-11">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl">
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input 
                  id="lat" 
                  type="number" 
                  step="any" 
                  placeholder="0.0000" 
                  className="bg-secondary/20 border-border/40 h-11"
                  value={formData.latitude}
                  onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input 
                  id="lng" 
                  type="number" 
                  step="any" 
                  placeholder="0.0000" 
                  className="bg-secondary/20 border-border/40 h-11"
                  value={formData.longitude}
                  onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description (Optional)</Label>
            <Textarea 
              id="desc" 
              placeholder="Add some notes about this property..." 
              className="bg-secondary/20 border-border/40 min-h-[100px]"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              className="flex-1 h-12 rounded-2xl" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-[2] h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Save Property
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
