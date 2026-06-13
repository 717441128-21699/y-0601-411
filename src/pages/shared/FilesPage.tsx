import { useState, useRef } from 'react';
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
  X,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { FileType, FileItem } from '@/types';

const typeConfig: Record<FileType, { label: string; icon: typeof FileText; color: string }> = {
  requirement: { label: '需求文件', icon: FileText, color: 'text-blue-500' },
  delivery: { label: '交付物', icon: Image, color: 'text-rose-gold-500' },
  contract: { label: '合同文件', icon: File, color: 'text-emerald-500' },
};

const fileTypeMap: Record<string, FileType> = {
  pdf: 'requirement',
  doc: 'requirement',
  docx: 'requirement',
  txt: 'requirement',
  jpg: 'delivery',
  jpeg: 'delivery',
  png: 'delivery',
  gif: 'delivery',
  mp4: 'delivery',
};

function getFileType(filename: string): FileType {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return fileTypeMap[ext] || 'requirement';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function FilesPage() {
  const { files, currentRole, addFile, couple, vendors, currentVendorId } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<'all' | FileType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<FileType>('requirement');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const canUpload = currentRole === 'couple' || currentRole === 'supplier' || currentRole === 'company';

  const getUploaderName = (): string => {
    if (currentRole === 'couple') return couple.name + ' & ' + couple.partnerName;
    if (currentRole === 'supplier') {
      const vendor = vendors.find((v) => v.id === currentVendorId);
      return vendor?.name || '供应商';
    }
    if (currentRole === 'company') return '良缘婚庆策划';
    return '未知用户';
  };

  const getDefaultUploadType = (): FileType => {
    if (currentRole === 'couple') return 'requirement';
    if (currentRole === 'supplier') return 'delivery';
    return 'contract';
  };

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    Array.from(fileList).forEach((file) => {
      const type = uploadType || getFileType(file.name);
      const newFile: FileItem = {
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        planId: 'plan-001',
        name: file.name,
        type,
        url: '',
        uploadedBy: getUploaderName(),
        uploadedByRole: currentRole || 'couple',
        uploadedAt: new Date().toLocaleString('zh-CN'),
        size: formatFileSize(file.size),
        category: type,
      };
      addFile(newFile);
    });

    setShowUploadModal(false);
    setUploadType(getDefaultUploadType());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const openUploadModal = () => {
    setUploadType(getDefaultUploadType());
    setShowUploadModal(true);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-rose-gold-800">文件中心</h2>
          <p className="text-sm text-fog-400 mt-1">管理您的婚礼相关文件</p>
        </div>

        {canUpload && (
          <button
            onClick={openUploadModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-gold-500 text-white rounded-xl font-medium hover:bg-rose-gold-600 transition-colors shadow-md"
          >
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
            <div className="text-2xl font-bold text-rose-gold-600 mb-2">{files.length} 个文件</div>
            <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 rounded-full transition-all"
                style={{ width: `${Math.min(files.length * 8, 100)}%` }}
              />
            </div>
            <p className="text-xs text-fog-400">共 {files.length} 个文件</p>
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

                    <div className="col-span-1 text-sm text-fog-400">{file.size}</div>

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

      {/* 上传弹窗 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-rose-gold-100">
              <h3 className="font-serif text-lg font-bold text-rose-gold-800">上传文件</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg hover:bg-rose-gold-50 text-fog-400 hover:text-rose-gold-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* 文件类型选择 */}
              <div>
                <label className="block text-sm font-medium text-rose-gold-700 mb-3">文件类型</label>
                <div className="flex gap-2">
                  {Object.entries(typeConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    const disabled =
                      (currentRole === 'couple' && key !== 'requirement') ||
                      (currentRole === 'supplier' && key !== 'delivery');
                    return (
                      <button
                        key={key}
                        onClick={() => !disabled && setUploadType(key as FileType)}
                        disabled={disabled}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          uploadType === key
                            ? 'bg-rose-gold-500 text-white'
                            : disabled
                            ? 'bg-fog-50 text-fog-300 cursor-not-allowed'
                            : 'bg-rose-gold-50 text-rose-gold-600 hover:bg-rose-gold-100'
                        }`}
                      >
                        <Icon size={16} />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 拖拽上传区域 */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  dragging
                    ? 'border-rose-gold-500 bg-rose-gold-50'
                    : 'border-rose-gold-200 hover:border-rose-gold-400 hover:bg-rose-gold-50/50'
                }`}
              >
                <div className="w-16 h-16 bg-rose-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} className="text-rose-gold-600" />
                </div>
                <p className="text-rose-gold-700 font-medium mb-1">
                  拖拽文件到此处，或点击选择文件
                </p>
                <p className="text-sm text-fog-400">支持 PDF、Word、图片等格式</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />

              {/* 提示信息 */}
              {currentRole === 'couple' && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600">
                    💡 提示：您可以上传需求文档、参考图片等，供婚庆公司和供应商了解您的需求
                  </p>
                </div>
              )}
              {currentRole === 'supplier' && (
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-emerald-600">
                    💡 提示：您可以上传交付物，如照片、视频、设计稿等
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-rose-gold-100">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-3 rounded-xl border border-rose-gold-200 text-rose-gold-600 font-medium hover:bg-rose-gold-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 rounded-xl bg-rose-gold-500 text-white font-medium hover:bg-rose-gold-600 transition-colors"
              >
                选择文件
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
