import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TrackingOrder {
    id: string;
    order_number?: string;
    order_status: string;
    payment_status: string;
    tracking_number: string | null;
    shipping_note: string | null;
    total_price: number;
    shipping_fee: number;
    order_items: {
        product_name: string;
        quantity: number;
        variation_name?: string | null;
    }[];
    created_at: string;
}

const OrderTracking: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState<TrackingOrder | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError(null);
        setOrder(null);
        setHasSearched(true);

        // Clean input: remove "Order", "#", and extra spaces
        const cleanInput = orderId.replace(/^Order\s*#?/i, '').replace(/#/g, '').trim();

        try {
            // Use secure RPC function to fetch order
            const { data, error } = await supabase
                .rpc('get_order_details', {
                    order_id_input: cleanInput
                })
                .single();

            if (error) {
                if (error.code === 'PGRST116') { // specific error code for no rows returned
                    setError('Order not found. Please check your Order ID or tracking number and try again.');
                } else if (error.message && error.message.includes('JSON object requested, multiple (or no) rows returned')) {
                    setError('Order not found or multiple matches. Please be more specific.');
                } else {
                    // General error
                    console.error('RPC Error:', error);
                    throw error;
                }
            } else if (data) {
                setOrder(data as TrackingOrder);
            } else {
                setError('Order not found.');
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            // Fallback for cases where RPC might fail or return nothing but not throw typical Supabase error
            setError('Order not found. Please check your Order ID and try again. (Make sure you applied the latest migration)');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status: string) => {
        const steps = ['new', 'confirmed', 'processing', 'shipped', 'delivered'];
        const statusIndex = steps.indexOf(status);
        if (status === 'cancelled') return -1;
        return statusIndex;
    };

    const currentStep = order ? getStatusStep(order.order_status) : 0;

    return (
        <div className="min-h-[70vh] bg-theme-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-theme-text mb-4">Track Your Order</h1>
                    <p className="text-gray-600">Enter your Order ID (e.g., PepTalk-10452) to check the current status of your package.</p>
                </div>

                {/* Search Box */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-200">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter Order ID (e.g., PepTalk-10452)"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-theme-accent focus:outline-none focus:ring-2 focus:ring-theme-accent/20 transition-colors text-lg"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !orderId.trim()}
                            className="bg-theme-accent hover:bg-theme-accent/90 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    Track Order
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Results */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 animate-fadeIn">
                        <AlertCircle className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                )}

                {hasSearched && order && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Status Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-theme-text p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
                                <div>
                                    <p className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-1">Order Status</p>
                                    <h2 className="text-2xl font-bold capitalize flex items-center gap-2 text-white">
                                        {order.order_status === 'new' && <Clock className="w-6 h-6" />}
                                        {order.order_status === 'confirmed' && <CheckCircle className="w-6 h-6 text-yellow-400" />}
                                        {order.order_status === 'processing' && <Package className="w-6 h-6 text-blue-400" />}
                                        {order.order_status === 'shipped' && <Truck className="w-6 h-6 text-green-400" />}
                                        {order.order_status === 'delivered' && <CheckCircle className="w-6 h-6 text-green-500" />}
                                        {order.order_status === 'cancelled' && <AlertCircle className="w-6 h-6 text-red-500" />}
                                        {order.order_status}
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-sm">Order ID</p>
                                    <p className="font-mono text-lg">{order.order_number || order.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                {/* Progress Bar */}
                                {order.order_status !== 'cancelled' ? (
                                    <div className="mb-8 overflow-x-auto pb-4">
                                        <div className="min-w-[500px]"> {/* Ensure min width for progress bar on mobile */}
                                            <div className="relative">
                                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full" />
                                                <div
                                                    className="absolute top-1/2 left-0 h-1 bg-theme-accent -translate-y-1/2 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min(100, Math.max(0, currentStep * 25))}%` }}
                                                />
                                                <div className="relative flex justify-between">
                                                    {['New', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
                                                        const isCompleted = index <= currentStep;
                                                        const isCurrent = index === currentStep;
                                                        return (
                                                            <div key={step} className="flex flex-col items-center gap-2 z-10">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white ${isCompleted ? 'border-theme-accent text-theme-accent' : 'border-gray-300 text-gray-300'
                                                                    } ${isCurrent ? 'ring-4 ring-theme-accent/20 scale-110' : ''}`}>
                                                                    {index < currentStep ? (
                                                                        <CheckCircle className="w-5 h-5 fill-white" />
                                                                    ) : (
                                                                        <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-theme-accent' : 'bg-gray-300'}`} />
                                                                    )}
                                                                </div>
                                                                <span className={`text-xs md:text-sm font-medium ${isCompleted ? 'text-theme-text' : 'text-gray-400'
                                                                    }`}>{step}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-red-50 rounded-xl p-4 border border-red-100 text-red-800 mb-6 flex items-center gap-3">
                                        <AlertCircle className="w-6 h-6 text-red-600" />
                                        <div>
                                            <p className="font-bold">Order Cancelled</p>
                                            <p className="text-sm">This order has been cancelled.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Tracking Details Block */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Shipping Info */}
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
                                        <h3 className="font-bold text-theme-text mb-4 flex items-center gap-2">
                                            <Truck className="w-5 h-5 text-theme-accent" />
                                            Tracking Information
                                        </h3>
                                        {order.tracking_number ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Tracking Number</p>
                                                    <p className="text-xl font-mono font-bold text-theme-text tracking-wide">{order.tracking_number}</p>
                                                </div>
                                                <a
                                                    href={`https://www.jtexpress.ph/trajectoryQuery?bills=${order.tracking_number}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full py-3 bg-theme-accent hover:bg-theme-accent/90 text-white text-center rounded-lg font-bold transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    Track on J&T Express
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                <Truck className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                                <p>No tracking number available yet.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {/* Shipping Note */}
                                        {order.shipping_note && (
                                            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 shadow-sm">
                                                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-blue-600" />
                                                    Shipping Update
                                                </h3>
                                                <p className="text-blue-800 text-sm leading-relaxed">{order.shipping_note}</p>
                                            </div>
                                        )}

                                        {/* Order Summary Summary */}
                                        <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
                                            <h3 className="font-bold text-theme-text mb-3 text-sm uppercase tracking-wider border-b pb-2">Order Summary</h3>
                                            <div className="space-y-2 mb-4">
                                                {order.order_items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm">
                                                        <span className="text-gray-600">
                                                            {item.quantity}x {item.product_name}
                                                            {item.variation_name && <span className="text-xs text-gray-400 block ml-4">{item.variation_name}</span>}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-gray-100 font-bold text-lg text-theme-text">
                                                <span>Total</span>
                                                <span>₱{(order.total_price + (order.shipping_fee || 0)).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
