import { useState } from 'react';
import { Award, Coins, Sparkles, ShieldCheck, Trophy } from 'lucide-react';

export default function Rewards() {
  const [userPoints, setUserPoints] = useState(450);
  const [claimedRewards, setClaimedRewards] = useState([]);

  const rewardsList = [
    { id: '1', title: 'Priority Case Dispatch', cost: 150, desc: 'Get your lost asset alert flagged instantly to top regional coordinators.', icon: ShieldCheck },
    { id: '2', title: 'Community Hero Badge', cost: 300, desc: 'Unlock an exclusive verified gold badge on your volunteer profile.', icon: Award },
    { id: '3', title: 'Verified Recovery Certificate', cost: 500, desc: 'Official digital certificate signed for successful asset recoveries.', icon: Trophy },
  ];

  const activeBounties = [
    { id: 'b1', title: 'MacBook Pro M2 (Bole Sector)', reward: '250 Points', status: 'Active Bounty' },
    { id: 'b2', title: 'Missing Passport Case #902', reward: '100 Points', status: 'Urgent' },
  ];

  const handleClaim = (reward) => {
    if (userPoints >= reward.cost && !claimedRewards.includes(reward.id)) {
      setUserPoints(userPoints - reward.cost);
      setClaimedRewards([...claimedRewards, reward.id]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 max-w-md mx-auto p-4 space-y-5 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Rewards & Bounties</h1>
        <p className="text-xs text-slate-500">Earn points for community asset recoveries and assistance</p>
      </div>

      {/* Points Summary Card */}
      <div 
        className="rounded-2xl p-5 text-white shadow-md relative overflow-hidden flex items-center justify-between"
        style={{ backgroundColor: '#0a2540' }}
      >
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-1.5 text-blue-200 text-xs font-medium">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Available Balance</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">{userPoints} <span className="text-sm font-normal text-slate-300">Pts</span></h2>
          <p className="text-[10px] text-slate-300 pt-1">Rank: Silver Responder • Top 15%</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-xs relative z-10">
          <Sparkles className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      {/* Active Community Bounties */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Bounties</h3>
        <div className="space-y-2.5">
          {activeBounties.map((b) => (
            <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
              <div className="space-y-0.5">
                <span className="text-[9px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-full">
                  {b.status}
                </span>
                <h4 className="text-xs font-bold text-slate-900 pt-1">{b.title}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-600">{b.reward}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redeemable Perks */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Redeem Rewards</h3>
        <div className="space-y-3">
          {rewardsList.map((item) => {
            const Icon = item.icon;
            const isClaimed = claimedRewards.includes(item.id);
            const canAfford = userPoints >= item.cost;

            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</p>
                  <p className="text-[10px] font-bold text-amber-600 pt-0.5">{item.cost} Points</p>
                </div>
                <button
                  onClick={() => handleClaim(item)}
                  disabled={isClaimed || !canAfford}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    isClaimed
                      ? 'bg-emerald-50 text-emerald-700 cursor-default'
                      : canAfford
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isClaimed ? 'Claimed' : 'Redeem'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}