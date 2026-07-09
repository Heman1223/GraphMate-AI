import { useEffect, useState } from 'react';
import NetworkGraph from '../components/graph/NetworkGraph';
import { graphService } from '../services/graph.service';
import type { INetworkData, INetworkStats } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';

export default function NetworkPage() {
  const [data, setData] = useState<INetworkData | null>(null);
  const [stats, setStats] = useState<INetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [networkData, networkStats] = await Promise.all([
          graphService.getNetworkData(),
          graphService.getNetworkStats()
        ]);
        setData(networkData);
        setStats(networkStats);
      } catch (err) {
        console.error('Failed to load network graph data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const selectedNode = data?.nodes.find((n: any) => n.id === selectedNodeId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8 min-h-[80vh] flex flex-col"
    >
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">
          Social Graph Visualizer
        </h1>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          Interactive map of your social network. Drag nodes to move, zoom, and select nodes to view connections.
        </p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Computing graph layout...</p>
          </div>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-start">
          {/* Main Graph View */}
          <div className="lg:col-span-3 h-[600px] w-full">
            <NetworkGraph data={data} onNodeClick={(id) => setSelectedNodeId(id || null)} />
          </div>

          {/* Sidebar Stats and Info Panel */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                Graph Statistics
              </h3>
              
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex justify-between items-center py-2 border-b border-border-light/20 dark:border-border-dark/20">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Total Nodes</span>
                  <span className="text-text-primary-light dark:text-text-primary-dark">{stats?.totalNodes}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-light/20 dark:border-border-dark/20">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Total Connections</span>
                  <span className="text-text-primary-light dark:text-text-primary-dark">{stats?.totalEdges}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-light/20 dark:border-border-dark/20">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Network Density</span>
                  <span className="text-text-primary-light dark:text-text-primary-dark">{stats ? Math.round(stats.density * 100) : 0}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-light/20 dark:border-border-dark/20">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Avg degree</span>
                  <span className="text-text-primary-light dark:text-text-primary-dark">{stats?.averageDegree !== undefined ? stats.averageDegree.toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </Card>

            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key="node-details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="p-6">
                    <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                      Node Details
                    </h3>
                    <div className="flex flex-col items-center text-center space-y-3">
                      <Avatar src={selectedNode.avatar} name={selectedNode.label} size="xl" />
                      <div>
                        <h4 className="font-black text-text-primary-light dark:text-text-primary-dark">{selectedNode.label}</h4>
                        <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark font-medium">@{selectedNode.username || 'user'}</p>
                      </div>
                      
                      {selectedNode.type === 'self' && (
                        <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-bold border border-cyan-500/20">
                          You (Local Node)
                        </div>
                      )}
                      {selectedNode.type === 'friend' && (
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
                          1st Degree Connection
                        </div>
                      )}
                      {selectedNode.type === 'mutual' && (
                        <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold border border-blue-500/20">
                          2nd Degree Connection
                        </div>
                      )}
                      
                      <div className="w-full h-px bg-border-light/20 dark:bg-border-dark/20 my-2" />
                      
                      <div className="w-full text-left space-y-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {selectedNode.college && (
                          <div className="flex justify-between">
                            <span>College</span>
                            <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">{selectedNode.college}</span>
                          </div>
                        )}
                        {selectedNode.branch && (
                          <div className="flex justify-between">
                            <span>Branch</span>
                            <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">{selectedNode.branch}</span>
                          </div>
                        )}
                        {selectedNode.city && (
                          <div className="flex justify-between">
                            <span>Location</span>
                            <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">{selectedNode.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="legend"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="p-6">
                    <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                      Node Legend
                    </h3>
                    <div className="space-y-3 text-xs font-semibold">
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 border border-cyan-400" />
                        <span className="text-text-primary-light dark:text-text-primary-dark">You (Local Node)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-400" />
                        <span className="text-text-primary-light dark:text-text-primary-dark">Accepted Friends (1st Degree)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-blue-400" />
                        <span className="text-text-primary-light dark:text-text-primary-dark">Mutual Connections (2nd Degree)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-400" />
                        <span className="text-text-primary-light dark:text-text-primary-dark">Suggested Connections</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          Failed to load social graph visualization.
        </div>
      )}
    </motion.div>
  );
}
