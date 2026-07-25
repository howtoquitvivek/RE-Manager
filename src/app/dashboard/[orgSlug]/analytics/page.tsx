"use client";
import React, { useState } from "react";
import { 
  TrendingUp, 
  Search, 
  SlidersHorizontal, 
  BarChart4, 
  DollarSign, 
  Building2, 
  Percent, 
  Calendar,
  Sparkles,
  ArrowUpRight,
  PieChart
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("yields");

  const regionalYields = [
    { region: "North Cluster NCR", residentialYield: "8.4%", commercialYield: "11.2%", occupancy: "95%" },
    { region: "South Cluster BLR", residentialYield: "7.8%", commercialYield: "10.5%", occupancy: "88%" },
    { region: "West Cluster BOM", residentialYield: "9.2%", commercialYield: "12.0%", occupancy: "92%" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-gradient/70 uppercase">
            Operational Analytics
          </h1>
          <p className="text-muted-foreground mt-2">Oversee cash flow metrics, regional project yields, RERA status analytics, and lease indices.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full border-border/50 bg-secondary/30">
            Export Report
          </Button>
          <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Sparkles className="h-4 w-4" /> AI Insights
          </Button>
        </div>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Annualized Yield</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">9.13%</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" /> +1.2% versus Q4 2025
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Gross Portfolio Rent</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">$162,200</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            IT Tech Parks leading
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Construction Speed</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">94.4%</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Milestones ahead of target
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Failed Compliance</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">0 Logs</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Zero regulatory warning events
          </p>
        </Card>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border/20 gap-6">
        <button 
          onClick={() => setActiveTab("yields")}
          className={`pb-4 text-sm uppercase tracking-wider font-extrabold transition-colors border-b-2 ${
            activeTab === "yields" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Regional Yields
        </button>
        <button 
          onClick={() => setActiveTab("revenue")}
          className={`pb-4 text-sm uppercase tracking-wider font-extrabold transition-colors border-b-2 ${
            activeTab === "revenue" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Asset Class Revenue
        </button>
      </div>

      {/* Analytics Content */}
      {activeTab === "yields" ? (
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <BarChart4 className="h-5 w-5 text-primary" /> Regional Yield Distribution
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Cross-territory ROI yield performance metrics.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/20 text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="py-4 font-bold">Hub Cluster Region</th>
                  <th className="py-4 font-bold">Residential yield</th>
                  <th className="py-4 font-bold">Commercial Yield</th>
                  <th className="py-4 font-bold">Average Occupancy</th>
                  <th className="py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {regionalYields.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/10 text-sm hover:bg-secondary/5 transition-colors group">
                    <td className="py-4 font-extrabold text-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" /> {row.region}
                    </td>
                    <td className="py-4 font-bold text-emerald-500">{row.residentialYield}</td>
                    <td className="py-4 font-bold text-emerald-500">{row.commercialYield}</td>
                    <td className="py-4 text-foreground font-semibold">{row.occupancy}</td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/5 rounded-full">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" /> Gross Revenue by Asset Class
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Breakdown of gross rental revenue distributions.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-secondary/10 border-border/20 p-5 rounded-2xl">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Residential Apartments</p>
              <p className="text-2xl font-extrabold text-foreground mt-2">$35,200/mo</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-4">
                <span>Contribution</span>
                <span className="font-bold text-foreground">21.7%</span>
              </div>
            </Card>
            <Card className="bg-secondary/10 border-border/20 p-5 rounded-2xl">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Commercial Grade A IT</p>
              <p className="text-2xl font-extrabold text-foreground mt-2">$92,000/mo</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-4">
                <span>Contribution</span>
                <span className="font-bold text-foreground">56.7%</span>
              </div>
            </Card>
            <Card className="bg-secondary/10 border-border/20 p-5 rounded-2xl">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Luxury Penthouses/Villas</p>
              <p className="text-2xl font-extrabold text-foreground mt-2">$35,000/mo</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-4">
                <span>Contribution</span>
                <span className="font-bold text-foreground">21.6%</span>
              </div>
            </Card>
          </div>
        </Card>
      )}
    </div>
  );
}
