"use client";

import { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { useAuth } from "../../../context/AuthContext";
import { useCenteredTree } from "../../../hooks/useCenteredTree";
import { 
  Search, 
  RotateCcw, 
  User as UserIcon, 
  Wallet, 
  Calendar, 
  Users, 
  TrendingUp, 
  Award,
  ArrowRight,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";

interface RawNodeDatum {
  name: string;
  _id?: string;
  attributes?: Record<string, string | number | boolean>;
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
  const [selectedNode, setSelectedNode] = useState<RawNodeDatum | null>(null);
  const [activeRootId, setActiveRootId] = useState<string>("");

  // Initialize activeRootId once user is loaded
  useEffect(() => {
    if (user?._id && !activeRootId) {
      setActiveRootId(String(user._id));
    }
  }, [user, activeRootId]);

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        if (!activeRootId) return;

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(`/api/users/${activeRootId}/hierarchy`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch hierarchy");

        const data = await response.json();
        setHierarchy(data);

        // If selectedNode is currently displayed, refresh its attributes too
        if (selectedNode) {
          const findNodeInTree = (node: RawNodeDatum): RawNodeDatum | null => {
            if (node._id === selectedNode._id || node.name === selectedNode.name) return node;
            if (node.children) {
              for (const child of node.children) {
                const found = findNodeInTree(child);
                if (found) return found;
              }
            }
            return null;
          };
          const updatedSelected = findNodeInTree(data);
          if (updatedSelected) {
            setSelectedNode(updatedSelected);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load hierarchy");
      }
    };

    fetchHierarchy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRootId]);

  const handleReset = () => {
    setTreeKey((prev) => prev + 1);
  };

  const handleDrillDown = (nodeId: string) => {
    if (nodeId) {
      setActiveRootId(nodeId);
      setSelectedNode(null);
    }
  };

  const handleBackToMainRoot = () => {
    if (user?._id) {
      setActiveRootId(String(user._id));
      setSelectedNode(null);
    }
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
        <div className="space-y-1 flex items-center gap-3">
          {activeRootId !== user?._id && (
            <button
              onClick={handleBackToMainRoot}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300"
              title="Back to Main Root"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div>
            <h4 className="text-base font-bold text-foreground">
              {activeRootId === user?._id ? "Referral Tree" : "Downline Explorer"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {activeRootId === user?._id 
                ? "Interactive map of downline referrals linked to your account."
                : "Exploring network relative to sub-member node."}
            </p>
          </div>
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
        className="h-[600px] w-full bg-slate-950 border border-white/5 rounded-3xl relative overflow-hidden flex"
      >
        {/* Ambient Grid overlay in SVG */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="flex-1 h-full w-full">
          <Tree
            key={treeKey}
            data={hierarchy}
            translate={translate}
            pathFunc="diagonal"
            orientation="vertical"
            nodeSize={{ x: 240, y: 170 }}
            zoomable={true}
            collapsible={false}
            renderCustomNodeElement={({ nodeDatum }) => {
              const isMatch = matchesSearch(nodeDatum.name);
              const kycStatus = String(nodeDatum.attributes?.kycStatus || "unverified");
              const level = Number(nodeDatum.attributes?.level || 0);

              // Border glow styles based on depth level
              let borderClass = "border-white/10 hover:border-white/20 hover:shadow-slate-900/50";
              let levelColor = "text-muted-foreground";

              if (level === 0) {
                borderClass = "border-amber-500/30 hover:border-amber-500/50 shadow-amber-500/5 hover:shadow-amber-500/10";
                levelColor = "text-amber-400";
              } else if (level === 1) {
                borderClass = "border-emerald-500/30 hover:border-emerald-500/50 shadow-emerald-500/5 hover:shadow-emerald-500/10";
                levelColor = "text-emerald-400";
              }

              // KYC indicator color dot
              let kycDotColor = "#94a3b8"; // unverified - grey
              if (kycStatus === "approved") kycDotColor = "#10b981"; // green
              else if (kycStatus === "pending") kycDotColor = "#f59e0b"; // orange
              else if (kycStatus === "rejected") kycDotColor = "#ef4444"; // red

              return (
                <g>
                  {/* Node connector dot */}
                  <circle r="7" fill={kycDotColor} className="animate-pulse" />

                  {/* HTML Card Container */}
                  <foreignObject width="210" height="130" x="-105" y="20">
                    <div
                      onClick={() => setSelectedNode(nodeDatum)}
                      className={`h-full w-full rounded-2xl p-4 shadow-2xl transition-all duration-300 flex flex-col justify-between text-left select-none cursor-pointer bg-slate-900/95 backdrop-blur-md ${
                        isMatch
                          ? "bg-primary/20 border-glow-emerald border border-primary text-foreground scale-102"
                          : `border ${borderClass} text-foreground`
                      }`}
                    >
                      {/* User profile section */}
                      <div className="flex items-start gap-2.5">
                        <div className={`h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0 ${levelColor}`}>
                          <UserIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold truncate pr-1">{nodeDatum.name}</p>
                            <span 
                              className="w-2 h-2 rounded-full shrink-0" 
                              style={{ backgroundColor: kycDotColor }}
                              title={`KYC: ${kycStatus}`}
                            />
                          </div>
                          <p className="text-[9px] text-muted-foreground truncate">
                            {level === 0 ? "Main Node" : `Level ${level} Downline`}
                          </p>
                        </div>
                      </div>

                      {/* Stats summary */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-[10px]">
                        <div className="space-y-0.5">
                          <p className="text-[8px] text-muted-foreground uppercase">Balance</p>
                          <p className="font-bold text-emerald-400">
                            ${typeof nodeDatum.attributes?.balance === "number"
                              ? nodeDatum.attributes.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              : "0.00"}
                          </p>
                        </div>
                        {nodeDatum.attributes?.referralCode && (
                          <div className="space-y-0.5 text-right">
                            <p className="text-[8px] text-muted-foreground uppercase">Ref Code</p>
                            <span className="font-bold text-accent text-glow-gold tracking-wide">
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

        {/* Sliding Side Details Drawer */}
        {selectedNode && (
          <div className="absolute top-0 right-0 h-full w-80 bg-slate-900/95 border-l border-white/10 backdrop-blur-xl shadow-2xl p-6 z-40 transition-all duration-300 flex flex-col justify-between text-slate-100">
            <div className="space-y-6 overflow-y-auto max-h-[80%] pr-1">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-extrabold text-foreground truncate uppercase tracking-wider" title={selectedNode.name}>
                    Member Profile
                  </h4>
                  <p className="text-[10px] text-muted-foreground truncate">{selectedNode.name}</p>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-lg text-muted-foreground hover:text-foreground transition-all"
                  title="Close panel"
                >
                  ✕
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 text-xs">
                <span className="text-muted-foreground">Compliance KYC</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  selectedNode.attributes?.kycStatus === "approved" 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : selectedNode.attributes?.kycStatus === "pending"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : selectedNode.attributes?.kycStatus === "rejected"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                }`}>
                  {String(selectedNode.attributes?.kycStatus || "unverified")}
                </span>
              </div>

              {/* Account Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1">
                    <Wallet className="h-3 w-3" /> Balance
                  </span>
                  <p className="text-xs font-bold text-foreground">
                    ${Number(selectedNode.attributes?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1">
                    <Award className="h-3 w-3" /> Equity
                  </span>
                  <p className="text-xs font-bold text-foreground">
                    {Number(selectedNode.attributes?.equityUnits || 0)} Units
                  </p>
                </div>
              </div>

              {/* Downline MLM Stats */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">Downline Statistics</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Direct Referrals</span>
                    <span className="font-bold text-foreground">{Number(selectedNode.attributes?.totalDirectReferrals || 0)} Members</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-muted-foreground flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> Direct Earnings</span>
                    <span className="font-bold text-emerald-400">+${Number(selectedNode.attributes?.commissionEarned || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Active Portfolios</span>
                    <span className="font-bold text-foreground">{Number(selectedNode.attributes?.purchasedPackagesCount || 0)} Packages</span>
                  </div>
                </div>
              </div>

              {/* Extra Meta */}
              <div className="space-y-2 text-[10px] text-muted-foreground">
                {selectedNode.attributes?.joinedAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Registered: {new Date(String(selectedNode.attributes.joinedAt)).toLocaleDateString()}</span>
                  </div>
                )}
                {selectedNode.attributes?.referralCode && (
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    <span>Referral Code: {String(selectedNode.attributes.referralCode)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Drilldown exploration button */}
            <div className="pt-4 border-t border-white/5">
              <button
                onClick={() => handleDrillDown(selectedNode.attributes?._id as string || selectedNode._id as string || "")}
                disabled={!selectedNode.attributes?._id && !selectedNode._id}
                className="w-full py-2.5 bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
              >
                <span>Explore Network Downline</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
