"use client";

import { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { useAuth } from "../../../context/AuthContext";
import { useCenteredTree } from "../../../hooks/useCenteredTree";
import { Search, RotateCcw, User as UserIcon, HelpCircle } from "lucide-react";

interface RawNodeDatum {
  name: string;
  attributes: Record<string, string | number | boolean>;
  children?: RawNodeDatum[];
}

type Hierarchy = RawNodeDatum | null;

export default function HierarchyTree() {
  const { user } = useAuth();
  const [hierarchy, setHierarchy] = useState<Hierarchy>(null);
  const [error, setError] = useState<string>("");
  const { translate, containerRef } = useCenteredTree();
  const [searchQuery, setSearchQuery] = useState("");
  const [treeKey, setTreeKey] = useState(0); // For resetting layout

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        if (!user?._id) return;

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(`/api/users/${user._id}/hierarchy`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch hierarchy");

        const data = await response.json();
        setHierarchy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load hierarchy");
      }
    };

    fetchHierarchy();
  }, [user]);

  const handleReset = () => {
    setTreeKey((prev) => prev + 1);
  };

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!hierarchy) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground animate-pulse">
        Loading hierarchy tree...
      </div>
    );
  }

  // Check if search matches the node name
  const matchesSearch = (name: string) => {
    if (!searchQuery) return false;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="relative flex flex-col space-y-6">
      {/* Hierarchy Controls Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/30 border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-foreground">Referral Tree</h4>
          <p className="text-xs text-muted-foreground">Interactive map of downline referrals linked to account.</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all duration-300 w-full sm:w-48"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300"
            title="Reset position"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* D3 Canvas Wrapper */}
      <div
        ref={containerRef}
        className="h-[600px] w-full bg-slate-950 border border-white/5 rounded-3xl relative overflow-hidden"
      >
        {/* Ambient Grid overlay in SVG */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <Tree
          key={treeKey}
          data={hierarchy}
          translate={translate}
          pathFunc="step"
          orientation="vertical"
          nodeSize={{ x: 220, y: 160 }}
          zoomable={true}
          collapsible={false}
          renderCustomNodeElement={({ nodeDatum }) => {
            const isMatch = matchesSearch(nodeDatum.name);
            const isPendingKyc = nodeDatum.attributes?.kycStatus === "pending";
            const level = Number(nodeDatum.attributes?.level || 0);

            return (
              <g>
                {/* Node connector dot */}
                <circle r="6" fill="#10b981" className="animate-pulse" />

                {/* HTML Card Container */}
                <foreignObject width="200" height="120" x="-100" y="20">
                  <div
                    className={`h-full w-full rounded-2xl p-4 shadow-2xl transition-all duration-300 flex flex-col justify-between text-left select-none ${
                      isMatch
                        ? "bg-primary/20 border-glow-emerald border border-primary text-foreground scale-102"
                        : "bg-slate-900 border border-white/10 hover:border-white/20 text-foreground"
                    }`}
                  >
                    {/* User profile section */}
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-primary shrink-0">
                        {isPendingKyc ? (
                          <HelpCircle className="h-4 w-4 text-amber-400" />
                        ) : (
                          <UserIcon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate">{nodeDatum.name}</p>
                        <p className="text-[9px] text-muted-foreground truncate">
                          Level {level} Network
                        </p>
                      </div>
                    </div>

                    {/* Stats summary */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="space-y-0.5">
                        <p className="text-[8px] text-muted-foreground uppercase">Balance</p>
                        <p className="text-[10px] font-bold text-emerald-400">
                          ${typeof nodeDatum.attributes?.balance === "number"
                            ? nodeDatum.attributes.balance.toFixed(2)
                            : "0.00"}
                        </p>
                      </div>
                      {nodeDatum.attributes?.referralCode && (
                        <div className="space-y-0.5 text-right">
                          <p className="text-[8px] text-muted-foreground uppercase">Ref Code</p>
                          <span className="text-[9px] font-bold text-accent text-glow-gold">
                            {nodeDatum.attributes.referralCode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          }}
        />
      </div>
    </div>
  );
}
