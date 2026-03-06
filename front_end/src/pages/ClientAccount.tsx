import { Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { useAuthStore } from '../stores/authStore';

import { Layout } from '../components/layout/Layout';
import  { useEffect, useState } from 'react';
 
import { OrdersTab } from '../components/account/OrdersTab';
import { WishlistTab } from '../components/account/WishlistTab';
import { PaymentMethodsTab } from '../components/account/PaymentMethodsTab';
import { SettingsTab } from '../components/account/SettingsTab';
import { ProfileTab } from '../components/account/ProfileTab';
import { AddressesTab } from '../components/account/AddressesTab';

//import { Link, useLocation } from 'react-router-dom';

type AccountTab = 'profile' | 'orders' | 'wishlist'|'addresses' | 'payment' | 'settings';
const navItems: { key: AccountTab; label: string; icon: React.ElementType }[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
  { key: 'payment', label: 'Payment Methods', icon: CreditCard },
  { key: 'settings', label: 'Settings', icon: Settings },
];
const ClientAccount = () => {
   
  const { user, logout} = useAuthStore();
   const [activeTab, setActiveTab] = useState<AccountTab>('profile');

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab/>
      case 'orders':
        return <OrdersTab/>;
      case 'wishlist':
        return <WishlistTab />;
        case 'addresses':
        return <AddressesTab />;
      case 'payment':
        return <PaymentMethodsTab />;
      case 'settings':
        return <SettingsTab />;
    }
  };

  



 

// HeartToggle component for wishlist icon
// function HeartToggle() {
//   const [liked, setLiked] = useState(false);
//   useEffect(() => {
//     try {
//       const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
//       setLiked(Array.isArray(wishlist) && wishlist.length > 0);
//     } catch {}
//   }, []);
//   const handleToggle = () => {
//     let wishlist = [];
//     try {
//       wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
//     } catch {}
//     if (liked) {
//       wishlist = [];
//     } else {
//       wishlist = ['dummy'];
//     }
//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
//     setLiked(!liked);
//   };
//   return (
//     <button onClick={handleToggle} aria-label="Toggle wishlist" type="button">
//       <Heart className={`h-6 w-6 ${liked ? 'text-red-500 fill-red-500' : 'text-accent'}`} />
//     </button>
//   );
// }
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground">Manage your account and view your orders</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                    {user?.name.charAt(0)}
                  </div>
                  <h2 className="font-display text-xl font-semibold">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Separator className="my-4" />
                <nav className="space-y-1">
                      {navItems.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        activeTab === key
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </nav>
                <Separator className="my-4" />
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

         <div className="lg:col-span-3">{renderTab()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientAccount;
