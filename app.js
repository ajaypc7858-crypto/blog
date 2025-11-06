import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Calendar, User, TrendingUp, Gamepad2, Film, Cpu, Briefcase, Scale, GraduationCap, Heart, Sparkles, Plus, ArrowLeft, Eye } from 'lucide-react';

const BlogWebsite = () => {
  const [theme, setTheme] = useState('pastel');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    category: 'technology',
    author: '',
    content: '',
    images: []
  });
  const [imageInput, setImageInput] = useState('');

  const ADMIN_PASSWORD = 'admin123'; // Yahan apna password set karo

  useEffect(() => {
    const loadData = async () => {
      try {
        const postsResult = await window.storage.get('blog_posts');
        if (postsResult && postsResult.value) {
          setPosts(JSON.parse(postsResult.value));
        }
      } catch (error) {
        console.log('No saved posts found');
      }

      try {
        const themeResult = await window.storage.get('blog_theme');
        if (themeResult && themeResult.value) {
          setTheme(themeResult.value);
        }
      } catch (error) {
        console.log('Using default theme');
      }
    };
    loadData();
  }, []);

  const savePosts = async (newPosts) => {
    try {
      await window.storage.set('blog_posts', JSON.stringify(newPosts));
      setPosts(newPosts);
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  };

  const saveTheme = async (newTheme) => {
    try {
      await window.storage.set('blog_theme', newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const themes = [
    { id: 'pastel', name: 'Soft Pastel', bg: 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50', card: 'bg-white', text: 'text-gray-800' },
    { id: 'mint', name: 'Mint Fresh', bg: 'bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50', card: 'bg-white', text: 'text-gray-800' },
    { id: 'peach', name: 'Peach Dream', bg: 'bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50', card: 'bg-white', text: 'text-gray-800' },
    { id: 'lavender', name: 'Lavender Sky', bg: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50', card: 'bg-white', text: 'text-gray-800' },
    { id: 'cream', name: 'Cream Soft', bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-lime-50', card: 'bg-white', text: 'text-gray-800' }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: Sparkles, color: 'from-pink-400 to-purple-400' },
    { id: 'business', name: 'Business', icon: Briefcase, color: 'from-amber-400 to-orange-400' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'from-blue-400 to-indigo-400' },
    { id: 'entertainment', name: 'Entertainment', icon: Film, color: 'from-purple-400 to-pink-400' },
    { id: 'gyan', name: 'Gyan', icon: GraduationCap, color: 'from-rose-400 to-pink-400' },
    { id: 'health', name: 'Health', icon: Heart, color: 'from-red-400 to-rose-400' },
    { id: 'lifestyle', name: 'Lifestyle', icon: Sparkles, color: 'from-teal-400 to-cyan-400' },
    { id: 'politics', name: 'Politics', icon: Scale, color: 'from-orange-400 to-red-400' },
    { id: 'sports', name: 'Sports', icon: Gamepad2, color: 'from-green-400 to-emerald-400' },
    { id: 'technology', name: 'Technology', icon: Cpu, color: 'from-blue-400 to-cyan-400' },
    { id: 'trending', name: 'Trending', icon: TrendingUp, color: 'from-rose-400 to-orange-400' }
  ];

  const getThemeClasses = () => {
    return themes.find(t => t.id === theme) || themes[0];
  };

  const themeClasses = getThemeClasses();

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setShowAddModal(true);
      setPassword('');
    } else {
      alert('Wrong password! Access denied.');
      setPassword('');
    }
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setNewPost({
        ...newPost,
        images: [...newPost.images, imageInput.trim()]
      });
      setImageInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setNewPost({
      ...newPost,
      images: newPost.images.filter((_, i) => i !== index)
    });
  };

  const handleAddPost = async () => {
    if (!newPost.title || !newPost.excerpt || !newPost.author || !newPost.content) {
      alert('Please fill all required fields');
      return;
    }

    const post = {
      id: Date.now(),
      ...newPost,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    await savePosts([post, ...posts]);
    setShowAddModal(false);
    setNewPost({ title: '', excerpt: '', category: 'technology', author: '', content: '', images: [] });
    setIsAuthenticated(false);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryData = (categoryId) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  // Full Article View
  if (selectedPost) {
    const categoryData = getCategoryData(selectedPost.category);
    return (
      <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text}`}>
        <header className={`sticky top-0 z-50 ${themeClasses.card} shadow-lg backdrop-blur-lg bg-opacity-95`}>
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button 
              onClick={() => setSelectedPost(null)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Blog</span>
            </button>
          </div>
        </header>

        <article className="max-w-4xl mx-auto px-4 py-8">
          <div className={`bg-gradient-to-r ${categoryData.color} text-white px-4 py-2 rounded-full inline-block mb-4`}>
            <span className="text-sm font-bold uppercase">{selectedPost.category}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{selectedPost.title}</h1>
          
          <div className="flex items-center space-x-4 text-gray-600 mb-8 text-sm">
            <span className="flex items-center space-x-1">
              <User size={16} />
              <span>{selectedPost.author}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{selectedPost.date}</span>
            </span>
          </div>

          {selectedPost.images && selectedPost.images.length > 0 && (
            <div className="mb-8 space-y-6">
              {selectedPost.images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`${selectedPost.title} - Image ${idx + 1}`}
                  className="w-full rounded-2xl shadow-2xl"
                />
              ))}
            </div>
          )}

          <div className={`${themeClasses.card} rounded-2xl p-8 shadow-lg`}>
            <div className="prose prose-lg max-w-none" style={{whiteSpace: 'pre-wrap'}}>
              {selectedPost.content}
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Main Blog List View
  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-all duration-500`}>
      <header className={`sticky top-0 z-50 ${themeClasses.card} shadow-lg backdrop-blur-lg bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                BlogHub Pro
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-3 md:px-4 py-2 rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus size={20} />
                <span className="hidden md:inline font-medium">Add Post</span>
              </button>
              <button 
                onClick={() => setShowThemeModal(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition text-2xl"
              >
                🎨
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2 bg-white rounded-full px-4 py-3 shadow-md">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search blogs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>
      </header>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Access</h2>
            <p className="text-gray-600 mb-6">Enter password to add new post</p>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 outline-none focus:border-purple-500 mb-4 text-gray-800"
            />
            <div className="flex space-x-3">
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-500 hover:to-purple-500 transition"
              >
                Submit
              </button>
              <button
                onClick={() => {setShowPasswordModal(false); setPassword('');}}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={() => setShowThemeModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Choose Theme</h2>
            <div className="space-y-3">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    saveTheme(t.id);
                    setShowThemeModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all transform hover:scale-105 ${
                    theme === t.id ? 'ring-4 ring-purple-400' : ''
                  } ${t.bg} shadow-md`}
                >
                  <span className="font-semibold text-gray-800">{t.name}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Post Modal */}
      {showAddModal && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl my-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Post</h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <input
                type="text"
                placeholder="Title *"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 outline-none focus:border-purple-400 text-gray-800"
              />
              <textarea
                placeholder="Short Description (Excerpt) *"
                value={newPost.excerpt}
                onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 outline-none focus:border-purple-400 h-24 text-gray-800"
              />
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 outline-none focus:border-purple-400 text-gray-800"
              >
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Author Name *"
                value={newPost.author}
                onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 outline-none focus:border-purple-400 text-gray-800"
              />
              <textarea
                placeholder="Full Article Content *"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 outline-none focus:border-purple-400 h-48 text-gray-800"
              />
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <p className="font-semibold mb-2 text-gray-800">Add Images (Optional)</p>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    placeholder="Paste image URL"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 outline-none focus:border-purple-400 text-gray-800"
                  />
                  <button
                    onClick={handleAddImage}
                    className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-500 transition"
                  >
                    Add
                  </button>
                </div>
                {newPost.images.length > 0 && (
                  <div className="space-y-2">
                    {newPost.images.map((img, idx) => (
                      <div key={idx} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                        <img src={img} alt="" className="w-16 h-16 object-cover rounded" />
                        <span className="flex-1 text-sm text-gray-600 truncate">{img}</span>
                        <button
                          onClick={() => handleRemoveImage(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleAddPost}
                className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-500 hover:to-purple-500 transition"
              >
                Publish Post
              </button>
              <button
                onClick={() => {setShowAddModal(false); setIsAuthenticated(false);}}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all transform hover:scale-105 shadow-md ${
                  activeCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white`
                    : 'bg-white text-gray-700 hover:shadow-lg'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Blog Posts */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">No Posts Yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first blog post!</p>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-105 shadow-lg"
            >
              Add Your First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => {
              const categoryData = getCategoryData(post.category);
              return (
                <article 
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {post.images && post.images[0] ? (
                      <img 
                        src={post.images[0]} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        📰
                      </div>
                    )}
                    <span className={`absolute top-4 left-4 bg-gradient-to-r ${categoryData.color} px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide shadow-lg`}>
                      {post.category}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-purple-600 transition text-gray-800">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <User size={14} />
                          <span>{post.author}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{post.date}</span>
                        </span>
                      </div>
                      <Eye size={16} className="text-purple-500" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">
            © 2025 BlogHub Pro. Made with ❤️ for bloggers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BlogWebsite;