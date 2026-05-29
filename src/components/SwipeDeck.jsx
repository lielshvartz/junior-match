import React, { useState, useRef, useEffect } from 'react';
import SwipeCard from './SwipeCard';

// Animation constants
const SWIPE_THRESHOLD = 120; // px distance to trigger swipe
const VELOCITY_THRESHOLD = 0.6; // px/ms
const MAX_TILT = 12; // degrees
const MAX_ROTATION = 45; // degrees on fling
const MIN_SCALE = 0.88;
const SCALE_STEP = 0.04; // per depth level
const DEPTH_OFFSET = -8; // px per card
const FLING_DURATION = 420; // ms
const RETURN_DURATION = 260; // ms
const SHADOW_BASE = '0 4px 6px -1px rgba(0,0,0,0.1)';
const SHADOW_LIFT = '0 20px 25px -5px rgba(0,0,0,0.2)';

export default function SwipeDeck({ items = [], onSwipe }) {
  const [stack, setStack] = useState(items);
  useEffect(() => setStack(items), [items]);

  const dragging = useRef({});

  // Keyboard support: Arrow Left = dislike, Arrow Right = like
  useEffect(() => {
    function handleKeyDown(e) {
      if (!stack.length) return;
      const top = document.querySelector('.swipe-deck .card.top');
      if (!top) return;
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const item = stack[0];
        setStack(s => s.slice(1));
        if (onSwipe) onSwipe('like', item);
        top.style.transition = `transform ${FLING_DURATION}ms cubic-bezier(.12,.8,.15,1), box-shadow 300ms ease`;
        top.style.transform = `translate3d(${window.innerWidth + 300}px, 0px, 0) rotate(45deg) skewY(8deg)`;
        top.style.boxShadow = `0 20px 30px -5px rgba(0,0,0,0.1)`;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const item = stack[0];
        setStack(s => s.slice(1));
        if (onSwipe) onSwipe('dislike', item);
        top.style.transition = `transform ${FLING_DURATION}ms cubic-bezier(.12,.8,.15,1), box-shadow 300ms ease`;
        top.style.transform = `translate3d(-${window.innerWidth + 300}px, 0px, 0) rotate(-45deg) skewY(-8deg)`;
        top.style.boxShadow = `0 20px 30px -5px rgba(0,0,0,0.1)`;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stack, onSwipe]);

  function setUnderStyles(progress) {
    // progress 0..1 based on top card drag distance
    const nodes = Array.from(document.querySelectorAll('.swipe-deck .card'));
    nodes.forEach((el, i) => {
      if (el.classList.contains('top')) return;
      const depthIndex = i;
      const baseScale = Math.max(MIN_SCALE, 1 - depthIndex * SCALE_STEP);
      const scale = baseScale + (1 - baseScale) * Math.min(0.9, progress * 1.2);
      const translateY = depthIndex * DEPTH_OFFSET * (1 - 0.5 * progress);
      const opacity = 0.9 + 0.1 * progress;
      // subtle shadow increase under the top card as it lifts
      const shadowAlpha = 0.1 + 0.1 * progress;
      const shadow = `0 ${8 + progress * 12}px ${16 + progress * 10}px -2px rgba(0,0,0,${shadowAlpha})`;
      
      el.style.transition = 'transform 120ms cubic-bezier(.2,.9,.3,1), box-shadow 120ms ease, opacity 120ms ease';
      el.style.transform = `translateY(${translateY}px) scale(${scale})`;
      el.style.opacity = opacity;
      el.style.boxShadow = shadow;
    });
  }

  function resetUnderStyles() {
    const nodes = Array.from(document.querySelectorAll('.swipe-deck .card'));
    nodes.forEach((el, i) => {
      if (el.classList.contains('top')) return;
      const depthIndex = i;
      const baseScale = Math.max(MIN_SCALE, 1 - depthIndex * SCALE_STEP);
      const translateY = depthIndex * DEPTH_OFFSET;
      
      el.style.transition = `transform ${RETURN_DURATION}ms cubic-bezier(.2,.9,.3,1), box-shadow 180ms ease, opacity 180ms ease`;
      el.style.transform = `translateY(${translateY}px) scale(${baseScale})`;
      el.style.opacity = 0.95;
      el.style.boxShadow = SHADOW_BASE;
    });
  }

  function onPointerDown(e) {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    dragging.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastTime: Date.now(),
      x: 0,
      y: 0,
      moving: true
    };
  }

  function onPointerMove(e) {
    if (!dragging.current.moving) return;
    const d = dragging.current;
    const now = Date.now();
    const dx = e.clientX - d.lastX;
    const dt = Math.max(1, now - d.lastTime);
    d.vx = dx / dt; // px per ms
    d.lastX = e.clientX;
    d.lastTime = now;

    d.x = e.clientX - d.startX;
    d.y = e.clientY - d.startY;
    const top = document.querySelector('.swipe-deck .card.top');
    if (top) {
      top.style.transition = 'none';
      // Calculate tilt based on drag direction and distance
      const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, d.x / 30));
      const rot = d.x / 18;
      // Dynamic shadow lift
      const dragProgress = Math.min(1, Math.abs(d.x) / SWIPE_THRESHOLD);
      const shadowAlpha = 0.15 + dragProgress * 0.15;
      const shadowLift = `0 ${12 + dragProgress * 16}px ${20 + dragProgress * 12}px -3px rgba(0,0,0,${shadowAlpha})`;
      
      top.style.transform = `translate3d(${d.x}px, ${d.y}px, 0) rotate(${rot}deg) skewY(${tilt * 0.3}deg)`;
      top.style.boxShadow = shadowLift;
    }

    // update under cards based on progress
    const prog = Math.min(1, Math.abs(d.x) / 300);
    setUnderStyles(prog);
  }

  function onPointerUp(e) {
    if (!dragging.current.moving) return;
    const d = dragging.current;
    d.moving = false;
    const top = document.querySelector('.swipe-deck .card.top');
    if (!top) return;
    
    const absX = Math.abs(d.x);
    const dir = d.x > 0 ? 1 : -1;
    const velocity = d.vx || (d.x / Math.max(1, Date.now() - d.lastTime));
    const velocityAbs = Math.abs(velocity);
    const shouldFling = absX > SWIPE_THRESHOLD || velocityAbs > VELOCITY_THRESHOLD;

    if (shouldFling) {
      const extra = Math.min(1, velocityAbs) * 600;
      const targetX = dir * (window.innerWidth + 300 + extra);
      top.style.transition = `transform ${FLING_DURATION}ms cubic-bezier(.12,.8,.15,1), box-shadow 300ms ease`;
      top.style.transform = `translate3d(${targetX}px, ${d.y}px, 0) rotate(${dir * MAX_ROTATION}deg) skewY(${dir * 8}deg)`;
      top.style.boxShadow = `0 ${20}px ${30}px -5px rgba(0,0,0,0.1)`;

      // animate under cards to final positions (scale up)
      setUnderStyles(1);

      setTimeout(() => {
        setStack(s => s.slice(1));
        if (onSwipe) onSwipe(dir > 0 ? 'like' : 'dislike', items[0]);
        // reset styles
        resetUnderStyles();
      }, FLING_DURATION + 20);
    } else {
      // return to center
      top.style.transition = `transform ${RETURN_DURATION}ms cubic-bezier(.2,.9,.3,1), box-shadow 180ms ease`;
      top.style.transform = '';
      top.style.boxShadow = SHADOW_LIFT;
      resetUnderStyles();
      setTimeout(() => {
        if (top) { top.style.transition = ''; top.style.transform = ''; top.style.boxShadow = SHADOW_BASE; }
      }, RETURN_DURATION + 20);
    }
    dragging.current = {};
  }

  return (
    <div className="swipe-deck" onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      {stack.length === 0 && <div style={{ textAlign: 'center', paddingTop: 40, color: 'var(--text-muted)' }}>אין עוד כרטיסים</div>}
      {stack.map((item, idx) => {
        const isTop = idx === 0;
        const depth = idx;
        const baseScale = Math.max(MIN_SCALE, 1 - depth * SCALE_STEP);
        const style = { zIndex: stack.length - idx, transform: `translateY(${depth * DEPTH_OFFSET}px) scale(${baseScale})`, touchAction: 'none' };
        
        const handleCardAction = (action) => {
          setStack(s => s.slice(1));
          if (onSwipe) onSwipe(action, item);
        };

        return (
          <div key={item.id || idx} style={{ position: 'absolute', width: '100%' }}>
            <div onPointerDown={(e) => isTop && onPointerDown(e)} className={`card ${isTop ? 'top' : ''}`} style={style}>
              <SwipeCard 
                item={item} 
                onLike={() => handleCardAction('like')}
                onDislike={() => handleCardAction('dislike')}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

