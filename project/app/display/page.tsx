"use client";

import { useEffect, useState } from 'react';
import { CartItem } from '@/lib/types';

export default function DisplayPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [idleMessage, setIdleMessage] = useState<string>("Welcome to Our Store!");

  useEffect(() => {
    // Listen for cart updates from localStorage
    const handleStorageChange = () => {
      const cartData = localStorage.getItem('pos-cart');
      if (cartData) {
        setCart(JSON.parse(cartData));
      } else {
        setCart([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // Initial load

    // Rotate idle messages
    const messages = [
      "Welcome to Our Store!",
      "Check out our daily specials!",
      "Thank you for shopping with us!",
      "Ask our staff about our loyalty program!",
    ];
    let messageIndex = 0;

    const messageInterval = setInterval(() => {
      if (cart.length === 0) {
        messageIndex = (messageIndex + 1) % messages.length;
        setIdleMessage(messages[messageIndex]);
      }
    }, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(messageInterval);
    };
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary animate-pulse">
            {idleMessage}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Current Order</h1>
        
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-card p-6 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <h2 className="text-2xl font-semibold">{item.name}</h2>
                <p className="text-muted-foreground">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="text-2xl font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-card p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex justify-between text-xl">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-3xl font-bold border-t pt-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}