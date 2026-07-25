"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicPersonalMap = dynamic<any>(
  () => import("./PersonalMap"),
  { 
    ssr: false, 
    loading: () => <div className="w-full h-full bg-secondary/20 animate-pulse rounded-xl" /> 
  }
);

interface PersonalMapWrapperProps {
  properties?: any[];
  workspaceType?: string;
  orgSlug?: string;
  isMini?: boolean;
}

export default function PersonalMapWrapper({ 
  properties = [], 
  workspaceType = "personal", 
  orgSlug = "", 
  isMini = false 
}: PersonalMapWrapperProps) {
  return (
    <DynamicPersonalMap 
      properties={properties} 
      workspaceType={workspaceType} 
      orgSlug={orgSlug} 
      isMini={isMini} 
    />
  );
}
