import { useState } from 'react';
import {
  Folder,
  FileText,
  Image,
  Upload,
  Download,
  Search,
  Filter,
  Clock,
  User,
  File,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { FileType } from '@/types';

const typeConfig: Record<FileType, { label: string; icon: typeof FileText; color: string }> = {
  requirement: { label: '需求文件', icon: FileText, color: 'text-blue-500' },
  delivery: { label: '交付物', icon: Image, color: 'text-rose-gold-500' },
  contract: { label: '合同文件', icon: File, color: 'text-emerald-500' },
};

export default function FilesPage() {
  const { files, currentRole } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<'all' | FileType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', label: '全部文件', count: files.length },
    { key: 'requirement', label: '需求文件', count: files.filter((f) => f.type === 'requirement').length },
    { key: 'delivery', label: '交付物', count: files.filter((f) => f.type === 'delivery').length },
    { key: 'contract', label: '合同文件', count: files.filter((f) => f.type === 'contract').length },
  ];

  const filteredFiles = files.filter((f) => {
    const matchCategory = activeCategory === 'all' || f.type === activeCategory;
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalSize = filteredFiles.reduce((sum) => sum + 1, 0);

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-rose-gold-800">文件中心</h2>
          <p className="text-sm text-fog-400 mt-1">管理您的婚礼相关文件</p>
        </div>

        {currentRole === 'couple' && (
          <button className="flex items-center gap-2 px-5 py-2.5 bg-rose-gold-500 text-white rounded-xl font-medium hover:bg-rose-gold-600 transition-colors shadow-md">
            <Upload size={18} />
            上传文件
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* 左侧分类 */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-rose-gold-100 shadow-soft">
            <h3 className="text-sm font-medium text-rose-gold-700 mb-4 flex items-center gap-2">
              <Folder size={16} />
              文件分类
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => {
                const config = cat.key === 'all' ? null : typeConfig[cat.key as FileType];
                const Icon = config?.icon || Folder;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key as 'all' | FileType)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      activeCategory === cat.key
                        ? 'bg-rose-gold-100 text-rose-gold-700 font-medium'
                        : 'text-fog-500 hover:bg-rose-gold-50 hover:text-rose-gold-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={config?.color || 'text-fog-400'} />
                      <span className="text-sm">{cat.label}</span>
                    </div>
                    <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 存储空间 */}
          <div className="bg-gradient-to-br from-rose-gold-50 to-blush-50 rounded-2xl p-5 border border-rose-gold-100">
            <h3 className="text-sm font-medium text-rose-gold-700 mb-3">存储空间</h3>
            <div className="text-2xl font-bold text-rose-gold-600 mb-2">
              {files.length} 个文件
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
              <div className="h-full w-1/3 bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 rounded-full" />
            </div>
            <p className="text-xs text-fog-400">已使用 32% 存储空间</p>
          </div>
        </div>

        {/* 右侧文件列表 */}
        <div className="col-span-3">
          {/* 搜索栏 */}
          <div className="bg-white rounded-2xl p-4 border border-rose-gold-100 shadow-soft mb-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-fog-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索文件名..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-ivory-50 border border-transparent focus:border-rose-gold-200 focus:bg-white outline-none transition-all text-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-fog-500 hover:bg-rose-gold-50 text-sm">
                <Filter size={16} />
                筛选
              </button>
            </div>
          </div>

          {/* 文件列表 */}
          <div className="bg-white rounded-2xl border border-rose-gold-100 shadow-soft overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-ivory-50 border-b border-rose-gold-100 text-xs font-medium text-fog-400">
              <div className="col-span-6">文件名</div>
              <div className="col-span-2">类型</div>
              <div className="col-span-2">上传时间</div>
              <div className="col-span-1">大小</div>
              <div className="col-span-1 text-center">操作</div>
            </div>

            <div className="divide-y divide-rose-gold-50">
              {filteredFiles.map((file) => {
                const typeInfo = typeConfig[file.type];
                const TypeIcon = typeInfo.icon;
                return (
                  <div
                    key={file.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-rose-gold-50/50 transition-colors items-center"
                  >
                    <div className="col-span-6 flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-rose-gold-50 flex items-center justify-center ${typeInfo.color}`}
                      >
                        <TypeIcon size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-rose-gold-800 text-sm">{file.name}</p>
                        <p className="text-xs text-fog-400 flex items-center gap-1">
                          <User size={10} />
                          {file.uploadedBy}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-rose-gold-50 text-rose-gold-600">
                        {typeInfo.label}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center gap-1 text-sm text-fog-400">
                      <Clock size={12} />
                      {file.uploadedAt}
                    </div>

                    <div className="col-span-1 text-sm text-fog-400">
                      {file.size}
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <button className="p-2 rounded-lg hover:bg-rose-gold-100 text-fog-400 hover:text-rose-gold-600 transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-medium text-rose-gold-700 mb-2">暂无文件</h3>
              <p className="text-fog-400">该分类下暂无文件</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
