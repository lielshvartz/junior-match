import React from 'react';

export default function SwipeCard({ item, style, onLike, onDislike }) {
  return (
    <div className="card" style={style}>
      <div>
        <h3>{item.title || item.name}</h3>
        {(item.company || item.location) && <div className="meta">{item.company} • {item.location}</div>}
        <div className="desc">{item.description || item.bio}</div>
      </div>
      <div className="card-actions">
        <button className="btn btn-dislike" onClick={() => onDislike && onDislike(item)}>❌</button>
        <button className="btn btn-like" onClick={() => onLike && onLike(item)}>❤️</button>
      </div>
    </div>
  );
}
