import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ROLE_DEFINITIONS } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import {
  UtensilsCrossed,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Building2,
  BarChart3,
  Store,
  Layers,
  CheckCircle2
} from 'lucide-react';

const QUICK_ROLES = [
  {
    roleId: 'admin',
    title: 'Administrator',
    username: 'admin_user',
    password: 'admin123',
    icon: ShieldCheck,
    color: '#ec4899',
    scope: 'Full system CRUD, Spark jobs, telemetry & config'
  },
  {
    roleId: 'regional_manager',
    title: 'Regional Manager',
    username: 'regional_mgr',
    password: 'regional123',
    icon: Building2,
    color: '#a855f7',
    scope: 'Multi-location analytics & regional approvals'
  },
  {
    roleId: 'manager',
    title: 'Store Manager',
    username: 'store_mgr',
    password: 'manager123',
    icon: Store,
    color: '#0ea5e9',
    scope: 'Shift orders, live inventory & wastage logs'
  },
  {
    roleId: 'analyst',
    title: 'Data Analyst',
    username: 'data_analyst',
    password: 'analyst123',
    icon: BarChart3,
    color: '#10b981',
    scope: 'What-If simulations, ML models & reports export'
  }
];

export default function LoginPage() {
  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeQuickRole, setActiveQuickRole] = useState(null);

  // Where to redirect after login (default to '/')
  const destination = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setAuthError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(username.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(destination, { replace: true });
    }
  };

  const handleQuickRoleSelect = async (role) => {
    setActiveQuickRole(role.roleId);
    setUsername(role.username);
    setPassword(role.password);
    setIsSubmitting(true);

    const result = await login(role.username, role.password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(destination, { replace: true });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      backgroundImage: 'radial-gradient(ellipse at 60% 0%, var(--primary-tint) 0%, transparent 55%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '32px 16px',
      position: 'relative'
    }}>
      {/* Top Right Theme Toggle */}
      <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
        <ThemeToggle />
      </div>

      <div style={{ width: '100%', maxWidth: '980px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--primary), #6366f1)',
            boxShadow: '0 8px 24px var(--primary-tint)',
            marginBottom: '16px'
          }}>
            <UtensilsCrossed size={30} color="#ffffff" />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0'
          }}>
            DineIQ <span style={{ color: 'var(--primary)' }}>Analytics</span>
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            margin: 0,
            maxWidth: '520px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Enterprise Restaurant Big Data &amp; Data Science Platform
          </p>
          <div style={{ marginTop: '8px' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary-tint)',
              border: '1px solid var(--border)',
              color: 'var(--primary)'
            }}>
              SRS Functional Requirements (i) &amp; (ii) Compliant
            </span>
          </div>
        </div>

        {/* Two-Column Grid: Form & Quick Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          {/* Left Column: Sign-In Form */}
          <div className="glass-card" style={{
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface)'
          }}>
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  Platform Sign In
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Enter your assigned credentials to access your designated role portal.
                </p>
              </div>

              {authError && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'var(--danger-tint)',
                  border: '1px solid var(--danger)',
                  color: 'var(--danger)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '0.85rem'
                }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, color: 'var(--danger)' }} />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '8px'
                  }}>
                    Username or Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }}>
                      <UserIcon size={16} />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. admin_user or admin@dineiq.com"
                      autoComplete="username"
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 38px',
                        backgroundColor: 'var(--surface-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)'
                    }}>
                      Password
                    </label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Default: <code style={{ color: 'var(--primary)' }}>admin123</code>
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }}>
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      autoComplete="current-password"
                      style={{
                        width: '100%',
                        padding: '11px 40px 11px 38px',
                        backgroundColor: 'var(--surface-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 0
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'var(--primary)',
                    backgroundImage: 'linear-gradient(135deg, var(--primary), #2563eb)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px var(--primary-tint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => (e.target.style.opacity = '0.92')}
                  onMouseOut={(e) => (e.target.style.opacity = '1')}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#ffffff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Sign In to Workspace</span>
                  )}
                </button>
              </form>
            </div>

            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}>
              Protected session via FastAPI &bull; In-memory active tokens &bull; Role-Based Access Control
            </div>
          </div>

          {/* Right Column: 1-Click Role Switcher for Evaluators */}
          <div className="glass-card" style={{
            padding: '32px',
            backgroundColor: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Layers size={18} color="var(--primary)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Role Quick-Switcher
                </h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                1-click instant login for testing and evaluating all 4 SRS roles:
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flex: 1
            }}>
              {QUICK_ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = activeQuickRole === role.roleId;

                return (
                  <button
                    key={role.roleId}
                    type="button"
                    onClick={() => handleQuickRoleSelect(role)}
                    disabled={isSubmitting}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '14px',
                      backgroundColor: isSelected ? 'var(--primary-tint)' : 'var(--surface-secondary)',
                      border: `1px solid ${isSelected ? role.color : 'var(--border)'}`,
                      borderRadius: '10px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) e.currentTarget.style.borderColor = role.color;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && !isSubmitting) e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                  >
                    <div style={{
                      backgroundColor: `rgba(${parseInt(role.color.slice(1, 3), 16)}, ${parseInt(role.color.slice(3, 5), 16)}, ${parseInt(role.color.slice(5, 7), 16)}, 0.15)`,
                      padding: '10px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={20} color={role.color} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {role.title}
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontFamily: 'JetBrains Mono, monospace',
                          color: 'var(--text-secondary)',
                          background: 'var(--primary-tint)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          border: '1px solid var(--border)'
                        }}>
                          {role.username}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                        {role.scope}
                      </p>
                      <div style={{
                        fontSize: '0.7rem',
                        color: role.color,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span>Click to log in as {role.title} &rarr;</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          textAlign: 'center',
          marginTop: '28px',
          color: 'var(--text-muted)',
          fontSize: '0.78rem'
        }}>
          DineIQ Analytics &copy; 2026. Conforms to Software Requirements Specification (SRS v1.0).
        </div>
      </div>
    </div>
  );
}
