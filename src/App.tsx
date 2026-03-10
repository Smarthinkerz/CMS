import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Switch } from './components/ui/switch';
import { Textarea } from './components/ui/textarea';
import {
  Globe,
  Zap,
  Shield,
  MonitorPlay,
  Smartphone,
  Code,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
  Database,
  Api,
  Puzzle
} from 'lucide-react';
import { useUniversalCMS, type SiteConfig } from './contexts/UniversalCMSContext';
import UniversalCRMDashboard from './components/admin/UniversalCRMDashboard';
import { toast } from 'sonner';

const App: React.FC = () => {
  const { 
    state, 
    connectToSite, 
    disconnectFromSite,
    trackEvent 
  } = useUniversalCMS();
  
  const [connectionForm, setConnectionForm] = useState<SiteConfig>({
    siteId: '',
    siteName: '',
    siteUrl: '',
    integration: 'plugin',
    apiEndpoint: '',
    authToken: ''
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Auto-connect if configuration exists
  useEffect(() => {
    const savedConfig = localStorage.getItem('universalCMS_siteConfig');
    if (savedConfig && !state.currentSite) {
      try {
        const config = JSON.parse(savedConfig);
        handleConnect(config, false);
      } catch (error) {
        console.error('Failed to load saved configuration:', error);
      }
    }
  }, []);

  const handleConnect = async (config?: SiteConfig, showToast = true) => {
    const configToUse = config || connectionForm;
    
    if (!configToUse.siteId || !configToUse.siteName || !configToUse.siteUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsConnecting(true);
    
    try {
      const success = await connectToSite(configToUse);
      
      if (success) {
        // Save configuration
        localStorage.setItem('universalCMS_siteConfig', JSON.stringify(configToUse));
        
        if (showToast) {
          toast.success(`Connected to ${configToUse.siteName}`);
        }
        
        trackEvent('site_connected', { 
          siteId: configToUse.siteId, 
          integration: configToUse.integration 
        });
      } else {
        toast.error('Failed to connect to site');
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectFromSite();
    localStorage.removeItem('universalCMS_siteConfig');
    toast.info('Disconnected from site');
    trackEvent('site_disconnected');
  };

  // If connected, show the main dashboard
  if (state.currentSite) {
    return (
      <Routes>
        <Route path="/*" element={<UniversalCRMDashboard />} />
      </Routes>
    );
  }

  // Connection setup screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <Globe className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Universal CRM Admin</h1>
          <p className="text-xl text-muted-foreground">
            Connect to any website and manage it with powerful CRM tools
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Connection Form */}
          <Card className="order-2 md:order-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Connect Your Website
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={connectionForm.integration} onValueChange={(value) => 
                setConnectionForm(prev => ({ 
                  ...prev, 
                  integration: value as SiteConfig['integration'] 
                }))
              }>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="plugin">Plugin</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                </TabsList>

                <TabsContent value="plugin" className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Plugin Integration</p>
                        <p className="text-sm text-blue-700">
                          Add our JavaScript plugin to your website for instant integration.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Site ID *</Label>
                      <Input
                        value={connectionForm.siteId}
                        onChange={(e) => setConnectionForm(prev => ({ 
                          ...prev, 
                          siteId: e.target.value 
                        }))}
                        placeholder="my-website"
                      />
                    </div>

                    <div>
                      <Label>Site Name *</Label>
                      <Input
                        value={connectionForm.siteName}
                        onChange={(e) => setConnectionForm(prev => ({ 
                          ...prev, 
                          siteName: e.target.value 
                        }))}
                        placeholder="My Awesome Website"
                      />
                    </div>

                    <div>
                      <Label>Website URL *</Label>
                      <Input
                        value={connectionForm.siteUrl}
                        onChange={(e) => setConnectionForm(prev => ({ 
                          ...prev, 
                          siteUrl: e.target.value 
                        }))}
                        placeholder="https://mywebsite.com"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="api" className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <Api className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">API Integration</p>
                        <p className="text-sm text-green-700">
                          Connect via REST API for full programmatic control.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Site ID *</Label>
                      <Input
                        value={connectionForm.siteId}
                        onChange={(e) => setConnectionForm(prev => ({ 
                          ...prev, 
                          siteId: e.target.value 
                        }))}
                        placeholder="my-website"
                      />
                    </div>

                    <div>
                      <Label>Site Name *</Label>
                      <Input
                        value={connectionForm.siteName}
                        onChange={(e) => setConnectionForm(prev => ({ 
                          ...prev, 
                          siteName: e.target.value 
                        }))}
                        placeholder="My Awesome Website"
                      />
                    </div>

                    <div>
                      <Label>Website URL *</Label>
                      <Input
                        value={connectionForm.siteUrl}
                        onChange={(e) => setConnectionForm(prev => ({ 
                          ...prev, 
                          siteUrl: e.target.value 
                        }))}
                        placeholder="https://mywebsite.com"
                      />
                    </div>

                    <div>
                      <Label>API Endpoint *</Label>
                      <Input
                        value={connectionForm.apiEndpoint}
                        onChange={(e) => setConnectionForm(prev => ({ 
                          ...prev, 
                          apiEndpoint: e.target.value 
                        }))}
                        placeholder="https://api.mywebsite.com/v1"
                      />
                    </div>

                    <div>
                      <Label>API Token *</Label>
                      <Input
                        type="password"
                        value={connectionForm.authToken}
                        onChange={(e) => setConnectionForm(prev => ({ 
                          ...prev, 
                          authToken: e.target.value 
                        }))}
                        placeholder="your-api-token"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleConnect()}
                  disabled={isConnecting}
                  className="flex-1"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowSetupGuide(!showSetupGuide)}
                >
                  <Code className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Connect Options */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Quick Connect:</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setConnectionForm({
                        siteId: 'demo-site',
                        siteName: 'Demo Website',
                        siteUrl: 'https://demo.example.com',
                        integration: 'plugin'
                      });
                    }}
                  >
                    Demo Site
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setConnectionForm({
                        siteId: 'localhost-dev',
                        siteName: 'Local Development',
                        siteUrl: 'http://localhost:3000',
                        integration: 'plugin'
                      });
                    }}
                  >
                    Local Dev
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <div className="order-1 md:order-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Features Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      icon: MonitorPlay, 
                      title: 'Live Site Editing', 
                      desc: 'Edit any website element in real-time' 
                    },
                    { 
                      icon: Database, 
                      title: 'Media Library', 
                      desc: 'Upload and manage all your media files' 
                    },
                    { 
                      icon: Smartphone, 
                      title: 'Responsive Design', 
                      desc: 'Preview and edit for all device sizes' 
                    },
                    { 
                      icon: Settings, 
                      title: 'Advanced Analytics', 
                      desc: 'Track visitors and site performance' 
                    }
                  ].map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{feature.title}</p>
                          <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Integration Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Integration Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plugin Support</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Integration</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Live Preview</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Analytics</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Setup Guide */}
        {showSetupGuide && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Puzzle className="w-5 h-5" />
                Integration Setup Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="plugin-setup">
                <TabsList>
                  <TabsTrigger value="plugin-setup">Plugin Setup</TabsTrigger>
                  <TabsTrigger value="api-setup">API Setup</TabsTrigger>
                </TabsList>

                <TabsContent value="plugin-setup" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">1. Add Script to Your Website</h4>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                      {`<script src="https://cdn.universalcrm.com/v1/universal-cms.js"></script>
<script>
  UniversalCMS.init({
    siteId: '${connectionForm.siteId || 'your-site-id'}',
    adminUrl: '${window.location.origin}'
  });
</script>`}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">2. Add Admin Access Point</h4>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                      {`<!-- Add this to your admin page or header -->
<div id="universal-cms-admin"></div>`}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">3. Test Connection</h4>
                    <p className="text-sm text-muted-foreground">
                      After adding the script, return here and click "Connect" to verify the integration.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="api-setup" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">1. API Endpoints Required</h4>
                    <div className="space-y-2">
                      <div className="bg-muted p-3 rounded text-sm">
                        <strong>GET</strong> /api/content/{'{section}'} - Get content
                      </div>
                      <div className="bg-muted p-3 rounded text-sm">
                        <strong>PUT</strong> /api/content/{'{section}'} - Update content
                      </div>
                      <div className="bg-muted p-3 rounded text-sm">
                        <strong>POST</strong> /api/media/upload - Upload media
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">2. Authentication Headers</h4>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                      Authorization: Bearer your-api-token
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">3. CORS Configuration</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow requests from {window.location.origin} in your API CORS settings.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default App;