import React, { useState } from 'react';
import { Plus, X, RotateCcw, FolderPlus, Tag } from 'lucide-react';
import { CategoryRule } from '../types';
import { DEFAULT_CATEGORY_RULES } from '../data';

interface CategoryConfiguratorProps {
  categories: CategoryRule[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryRule[]>>;
}

export function CategoryConfigurator({
  categories,
  setCategories,
}: CategoryConfiguratorProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id || '');
  const [newExtInput, setNewExtInput] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const name = newCategoryName.trim();
    const newCat: CategoryRule = {
      id: `cat-${Date.now()}`,
      name,
      extensions: [],
      color: 'indigo',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badgeText: 'text-indigo-700',
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCategoryName('');
    setActiveCategoryId(newCat.id);
  };

  const handleAddExtension = (catId: string) => {
    if (!newExtInput.trim()) return;
    let ext = newExtInput.trim().toLowerCase();
    if (!ext.startsWith('.')) {
      ext = `.${ext}`;
    }

    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId && !c.extensions.includes(ext)) {
          return {
            ...c,
            extensions: [...c.extensions, ext],
          };
        }
        return c;
      })
    );
    setNewExtInput('');
  };

  const handleRemoveExtension = (catId: string, extToRemove: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          return {
            ...c,
            extensions: c.extensions.filter((e) => e !== extToRemove),
          };
        }
        return c;
      })
    );
  };

  const handleRemoveCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    if (activeCategoryId === catId) {
      setActiveCategoryId(categories[0]?.id || '');
    }
  };

  const handleResetDefaults = () => {
    setCategories(DEFAULT_CATEGORY_RULES);
    setActiveCategoryId(DEFAULT_CATEGORY_RULES[0].id);
  };

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0];

  return (
    <div className="space-y-6">
      {/* Overview & Reset */}
      <div className="bg-[#0F0F12] rounded-xl border border-white/10 p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">
            File Extension Categorization Rules
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure which file extensions are organized into specific destination folders.
          </p>
        </div>

        <button
          id="btn-reset-categories"
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Defaults</span>
        </button>
      </div>

      {/* Categories Grid & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Categories */}
        <div className="bg-[#0F0F12] rounded-xl border border-white/10 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Folder Categories ({categories.length})
            </span>
          </div>

          <div className="space-y-1 max-h-[380px] overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                  activeCategoryId === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs font-medium'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    activeCategoryId === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {cat.extensions.length} ext
                </span>
              </button>
            ))}
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="pt-3 border-t border-white/10 flex gap-2">
            <input
              id="input-new-category-name"
              type="text"
              placeholder="New folder (e.g. 3D Models)..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 text-xs bg-black/40 text-gray-200 placeholder-gray-600 px-2.5 py-1.5 rounded-lg border border-white/10 focus:outline-hidden focus:border-indigo-500/60 font-mono"
            />
            <button
              id="btn-add-category"
              type="submit"
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
              title="Add folder category"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Active Category Details & Extension Tags */}
        <div className="lg:col-span-2 bg-[#0F0F12] rounded-xl border border-white/10 p-5 shadow-xl space-y-4">
          {activeCategory ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-white font-mono">
                      {activeCategory.name}/
                    </h3>
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">destination folder</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Files matching the extensions below will automatically be moved to this folder.
                  </p>
                </div>

                {categories.length > 1 && (
                  <button
                    onClick={() => handleRemoveCategory(activeCategory.id)}
                    className="text-xs text-rose-300 hover:text-rose-200 font-medium px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                  >
                    Delete Folder
                  </button>
                )}
              </div>

              {/* Add Extension to this category */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-add-extension"
                    type="text"
                    placeholder="Add extension (e.g. .blend, .fbx, .obj)..."
                    value={newExtInput}
                    onChange={(e) => setNewExtInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddExtension(activeCategory.id);
                      }
                    }}
                    className="w-full text-xs bg-black/40 text-gray-200 placeholder-gray-600 pl-8 pr-3 py-2 rounded-lg border border-white/10 focus:outline-hidden focus:border-indigo-500/60 font-mono"
                  />
                </div>
                <button
                  id="btn-add-extension"
                  type="button"
                  onClick={() => handleAddExtension(activeCategory.id)}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Ext</span>
                </button>
              </div>

              {/* Badges list */}
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2.5">
                  Mapped Extensions ({activeCategory.extensions.length})
                </span>

                {activeCategory.extensions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-500 italic bg-black/40 border border-white/10 rounded-lg">
                    No extensions mapped to this folder yet. Add one above.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {activeCategory.extensions.map((ext) => (
                      <span
                        key={ext}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white/10 text-indigo-300 border border-white/10 hover:border-indigo-500/30 transition-colors group"
                      >
                        <span>{ext}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExtension(activeCategory.id, ext)}
                          className="text-gray-400 hover:text-rose-400 transition-colors"
                          title={`Remove ${ext}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500 text-xs">
              No category selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
