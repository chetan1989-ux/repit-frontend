
import React, { useState } from 'react';

const CreateContentPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, content, isPremium });
    // TODO: Implement content submission
  };

  return (
    <div className="page create-page">
      <h1>Create New Content</h1>
      <form onSubmit={handleSubmit} className="content-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            required
          />
        </div>
        
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="premium"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
          />
          <label htmlFor="premium">Premium Content (Subscribers Only)</label>
        </div>
        
        <div className="form-actions">
          <button type="button" className="button secondary">Save as Draft</button>
          <button type="submit" className="button primary">Publish</button>
        </div>
      </form>
    </div>
  );
};

export default CreateContentPage;
