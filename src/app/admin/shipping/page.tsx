'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLayout from '@/components/AdminLayout';
import { 
  TruckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface ShippingZone {
  _id: string;
  name: string;
  countries: string[];
  regions: string[];
  freeShippingThreshold: number;
  standardRate: number;
  expressRate: number;
  estimatedDays: {
    standard: number;
    express: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ShippingMethod {
  _id: string;
  name: string;
  description: string;
  type: 'standard' | 'express' | 'overnight';
  baseRate: number;
  freeShippingThreshold: number;
  estimatedDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminShipping() {
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'zones' | 'methods'>('zones');
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin-login');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      loadShippingData();
    }
  }, [isAdmin]);

  const loadShippingData = async () => {
    setLoading(true);
    try {
      const [zonesRes, methodsRes] = await Promise.all([
        fetch('/api/shipping/zones'),
        fetch('/api/shipping/methods')
      ]);
      
      const zonesData = await zonesRes.json();
      const methodsData = await methodsRes.json();
      
      setShippingZones(zonesData.data || zonesData || []);
      setShippingMethods(methodsData.data || methodsData || []);
    } catch (error) {
      console.error('Error loading shipping data:', error);
      // Set mock data if API fails
      setShippingZones([
        {
          _id: '1',
          name: 'Domestic (Pakistan)',
          countries: ['Pakistan'],
          regions: ['All'],
          freeShippingThreshold: 5000,
          standardRate: 200,
          expressRate: 500,
          estimatedDays: { standard: 3, express: 1 },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'International',
          countries: ['United States', 'United Kingdom', 'Canada', 'Australia'],
          regions: ['North America', 'Europe', 'Oceania'],
          freeShippingThreshold: 15000,
          standardRate: 1500,
          expressRate: 3000,
          estimatedDays: { standard: 7, express: 3 },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
      
      setShippingMethods([
        {
          _id: '1',
          name: 'Standard Shipping',
          description: 'Regular delivery within estimated timeframe',
          type: 'standard',
          baseRate: 200,
          freeShippingThreshold: 5000,
          estimatedDays: 3,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Express Shipping',
          description: 'Fast delivery for urgent orders',
          type: 'express',
          baseRate: 500,
          freeShippingThreshold: 10000,
          estimatedDays: 1,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '3',
          name: 'Overnight Delivery',
          description: 'Next day delivery for premium orders',
          type: 'overnight',
          baseRate: 1000,
          freeShippingThreshold: 20000,
          estimatedDays: 1,
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleZoneStatus = async (id: string) => {
    try {
      const zone = shippingZones.find(z => z._id === id);
      if (!zone) return;

      const response = await fetch('/api/shipping/zones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          isActive: !zone.isActive
        })
      });

      if (response.ok) {
        setShippingZones(shippingZones.map(z => 
          z._id === id ? { ...z, isActive: !z.isActive } : z
        ));
      }
    } catch (error) {
      console.error('Error updating zone status:', error);
    }
  };

  const toggleMethodStatus = async (id: string) => {
    try {
      const method = shippingMethods.find(m => m._id === id);
      if (!method) return;

      const response = await fetch('/api/shipping/methods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          isActive: !method.isActive
        })
      });

      if (response.ok) {
        setShippingMethods(shippingMethods.map(m => 
          m._id === id ? { ...m, isActive: !m.isActive } : m
        ));
      }
    } catch (error) {
      console.error('Error updating method status:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(price);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'express': return 'bg-orange-100 text-orange-800';
      case 'overnight': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout title="Shipping Management">
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('zones')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'zones'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Shipping Zones
            </button>
            <button
              onClick={() => setActiveTab('methods')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'methods'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Shipping Methods
            </button>
          </nav>
        </div>
      </div>

      {/* Shipping Zones Tab */}
      {activeTab === 'zones' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Shipping Zones</h3>
            <button
              onClick={() => setShowZoneModal(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Zone
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shippingZones.map((zone) => (
              <div key={zone._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{zone.name}</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleZoneStatus(zone._id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          zone.isActive ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            zone.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Countries</p>
                      <p className="text-sm text-gray-900">{zone.countries.join(', ')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Standard Rate</p>
                        <p className="text-lg font-semibold text-gray-900">{formatPrice(zone.standardRate)}</p>
                        <p className="text-xs text-gray-500">{zone.estimatedDays.standard} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Express Rate</p>
                        <p className="text-lg font-semibold text-gray-900">{formatPrice(zone.expressRate)}</p>
                        <p className="text-xs text-gray-500">{zone.estimatedDays.express} days</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Free Shipping Threshold</p>
                      <p className="text-sm font-semibold text-gray-900">{formatPrice(zone.freeShippingThreshold)}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        zone.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {zone.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingZone(zone);
                            setShowZoneModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shipping Methods Tab */}
      {activeTab === 'methods' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Shipping Methods</h3>
            <button
              onClick={() => setShowMethodModal(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Method
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Free Threshold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shippingMethods.map((method) => (
                    <tr key={method._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(method.type)}`}>
                          {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(method.baseRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(method.freeShippingThreshold)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {method.estimatedDays} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          method.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {method.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingMethod(method);
                              setShowMethodModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleMethodStatus(method._id)}
                            className={`${
                              method.isActive 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {method.isActive ? (
                              <XCircleIcon className="h-4 w-4" />
                            ) : (
                              <CheckCircleIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Zone Modal */}
      {showZoneModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingZone ? 'Edit Shipping Zone' : 'Add New Shipping Zone'}
              </h3>
              <button
                onClick={() => {
                  setShowZoneModal(false);
                  setEditingZone(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone Name *
                </label>
                <input
                  type="text"
                  defaultValue={editingZone?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter zone name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Countries *
                </label>
                <input
                  type="text"
                  defaultValue={editingZone?.countries.join(', ') || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter countries (comma separated)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Standard Rate (PKR) *
                  </label>
                  <input
                    type="number"
                    defaultValue={editingZone?.standardRate || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Express Rate (PKR) *
                  </label>
                  <input
                    type="number"
                    defaultValue={editingZone?.expressRate || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Standard Delivery (Days) *
                  </label>
                  <input
                    type="number"
                    defaultValue={editingZone?.estimatedDays.standard || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Express Delivery (Days) *
                  </label>
                  <input
                    type="number"
                    defaultValue={editingZone?.estimatedDays.express || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Free Shipping Threshold (PKR) *
                </label>
                <input
                  type="number"
                  defaultValue={editingZone?.freeShippingThreshold || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="5000"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={editingZone?.isActive ?? true}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active Zone</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowZoneModal(false);
                    setEditingZone(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  {editingZone ? 'Update Zone' : 'Create Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Method Modal */}
      {showMethodModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingMethod ? 'Edit Shipping Method' : 'Add New Shipping Method'}
              </h3>
              <button
                onClick={() => {
                  setShowMethodModal(false);
                  setEditingMethod(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Method Name *
                </label>
                <input
                  type="text"
                  defaultValue={editingMethod?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter method name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  defaultValue={editingMethod?.description || ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter method description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  defaultValue={editingMethod?.type || 'standard'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                  <option value="overnight">Overnight</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Rate (PKR) *
                  </label>
                  <input
                    type="number"
                    defaultValue={editingMethod?.baseRate || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Shipping Threshold (PKR) *
                  </label>
                  <input
                    type="number"
                    defaultValue={editingMethod?.freeShippingThreshold || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery Days *
                </label>
                <input
                  type="number"
                  defaultValue={editingMethod?.estimatedDays || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="3"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={editingMethod?.isActive ?? true}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active Method</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowMethodModal(false);
                    setEditingMethod(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  {editingMethod ? 'Update Method' : 'Create Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
