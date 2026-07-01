'use client';

import React, { useState } from 'react';
import { Upload, Trash2, Copy, Search, Check, FileImage } from 'lucide-react';

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size: string;
  created_at: string;
}

const INITIAL_ASSETS: MediaAsset[] = [
  { id: '1', name: 'algorithmic_commons.jpg', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', size: '240 KB', created_at: '2026-05-18' },
  { id: '2', name: 'semiconductors_global.jpg', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', size: '412 KB', created_at: '2026-05-23' },
  { id: '3', name: 'biotech_equity.jpg', url: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=800', size: '185 KB', created_at: '2026-05-25' },
  { id: '4', name: 'green_colonialism.jpg', url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800', size: '310 KB', created_at: '2026-05-27' },
  { id: '5', name: 'youth_unions.jpg', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800', size: '198 KB', created_at: '2026-05-29' },
  { id: '6', name: 'mental_health_systems.jpg', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800', size: '280 KB', created_at: '2026-05-30' }
];

export default function AdminMediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>(INITIAL_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const filesArray = Array.from(e.target.files);
    const newAssets: MediaAsset[] = filesArray.map((file, idx) => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        id: `upload-${Date.now()}-${idx}`,
        name: file.name,
        // Generate temporary local Object URL for visual demonstration
        url: URL.createObjectURL(file),
        size: `${sizeMB} MB`,
        created_at: new Date().toISOString().split('T')[0]
      };
    });

    setAssets([...newAssets, ...assets]);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    setAssets(assets.filter(asset => asset.id !== id));
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Media Library</h1>
          <p className="text-xs text-muted mt-1">Upload and organize illustration assets for article cover images.</p>
        </div>
        
        {/* Upload Button */}
        <label className="bg-accent text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-accent/90 shadow-md flex items-center space-x-1.5 cursor-pointer transition-all">
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Search Filter */}
      <div className="relative flex items-center max-w-md">
        <input
          type="text"
          placeholder="Filter files by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card-bg border border-border text-foreground px-4 py-2 pl-9 rounded-lg text-xs focus:outline-none focus:border-accent"
        />
        <Search className="w-3.5 h-3.5 text-muted absolute left-3" />
      </div>

      {/* Grid of Assets */}
      {filteredAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-border border-dashed rounded-xl p-12 text-center bg-card-bg">
          <FileImage className="w-12 h-12 text-muted mb-4" />
          <p className="font-serif text-lg font-bold">No assets found</p>
          <p className="text-xs text-muted mt-1">Refine search keywords or drag new items above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <div 
              key={asset.id} 
              className="group border border-border bg-card-bg rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-accent transition-colors"
            >
              {/* Preview Thumbnail */}
              <div className="h-40 relative w-full overflow-hidden bg-foreground/5 flex items-center justify-center">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Asset Specs */}
              <div className="p-4 space-y-3 bg-foreground/[0.02] border-t border-border">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  <div className="flex justify-between text-[10px] text-muted font-medium">
                    <span>{asset.size}</span>
                    <span>{asset.created_at}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-1 border-t border-border/40">
                  <button
                    onClick={() => handleCopy(asset.url, asset.id)}
                    className="flex-grow flex items-center justify-center space-x-1 py-1.5 border border-border hover:border-accent hover:text-accent rounded bg-background transition-colors text-[10px] font-bold uppercase tracking-wider"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-accent" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-1.5 border border-border hover:border-red-500 hover:text-red-500 rounded bg-background transition-colors text-muted"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
