import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { 
  Box, Button, Card, Dialog, Flex, Heading, Text, 
  Badge, IconButton, Separator, Switch, ScrollArea
} from '@radix-ui/themes';
import { 
  Bell, BellOff, Check, CheckCheck, Trash2, Clock, 
  Trophy, Users, AlertCircle, Settings, X, Volume2,
  VolumeX, Mail, Smartphone, Calendar, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export function NotificationCenter() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showDialog, setShowDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const { 
    notifications, 
    unreadCount,
    preferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
    requestNotificationPermission
  } = useNotificationStore();

  useEffect(() => {
    if (user) {
      // Set up periodic check for reminders (every minute)
      const interval = setInterval(() => {
        useNotificationStore.getState().checkAndSendReminders(user.uid);
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'system': return <AlertCircle className="h-4 w-4" />;
      case 'challenge': return <Calendar className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'gray';
      default: return 'blue';
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      navigate({ to: notification.actionUrl as any });
      setShowDialog(false);
    }
  };

  const groupedNotifications = notifications.reduce((acc, notif) => {
    const date = new Date(notif.createdAt).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(notif);
    return acc;
  }, {} as Record<string, typeof notifications>);

  return (
    <>
      {/* Notification Bell Button */}
      <Box className="relative">
        <IconButton
          size="2"
          variant="ghost"
          onClick={() => setShowDialog(true)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Box className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Box>
          )}
        </IconButton>
      </Box>

      {/* Notification Dialog */}
      <Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
        <Dialog.Content maxWidth="500px" className="max-h-[80vh]">
          <Flex direction="column" className="h-full">
            {/* Header */}
            <Flex justify="between" align="center" mb="3">
              <Heading size="5">Notifications</Heading>
              <Flex gap="2">
                {unreadCount > 0 && (
                  <Button size="1" variant="ghost" onClick={() => {
                    if (user) markAllAsRead(user.uid);
                  }}>
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <IconButton 
                  size="1" 
                  variant="ghost"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </IconButton>
                <Dialog.Close>
                  <IconButton size="1" variant="ghost">
                    <X className="h-4 w-4" />
                  </IconButton>
                </Dialog.Close>
              </Flex>
            </Flex>

            {showSettings ? (
              /* Settings Panel */
              <Box className="flex-1 overflow-y-auto">
                <Card>
                  <Heading size="4" mb="4">Notification Settings</Heading>
                  
                  <Flex direction="column" gap="4">
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="2">
                        <Bell className="h-4 w-4" />
                        <Text>Push Notifications</Text>
                      </Flex>
                      <Switch 
                        checked={preferences.pushEnabled}
                        onCheckedChange={async (checked) => {
                          if (checked) {
                            const granted = await requestNotificationPermission();
                            if (granted && user) {
                              updatePreferences(user.uid, { pushEnabled: true });
                            }
                          } else if (user) {
                            updatePreferences(user.uid, { pushEnabled: false });
                          }
                        }}
                      />
                    </Flex>
                    
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="2">
                        <Mail className="h-4 w-4" />
                        <Text>Email Notifications</Text>
                      </Flex>
                      <Switch 
                        checked={preferences.emailEnabled}
                        onCheckedChange={(checked) => {
                          if (user) updatePreferences(user.uid, { emailEnabled: checked });
                        }}
                      />
                    </Flex>
                    
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="2">
                        <Volume2 className="h-4 w-4" />
                        <Text>Sound</Text>
                      </Flex>
                      <Switch 
                        checked={preferences.soundEnabled}
                        onCheckedChange={(checked) => {
                          if (user) updatePreferences(user.uid, { soundEnabled: checked });
                        }}
                      />
                    </Flex>
                    
                    <Separator />
                    
                    <Heading size="3">Notification Types</Heading>
                    
                    <Flex justify="between" align="center">
                      <Text size="2">Achievement Alerts</Text>
                      <Switch 
                        checked={preferences.achievementAlerts}
                        onCheckedChange={(checked) => {
                          if (user) updatePreferences(user.uid, { achievementAlerts: checked });
                        }}
                      />
                    </Flex>
                    
                    <Flex justify="between" align="center">
                      <Text size="2">Social Notifications</Text>
                      <Switch 
                        checked={preferences.socialAlerts}
                        onCheckedChange={(checked) => {
                          if (user) updatePreferences(user.uid, { socialAlerts: checked });
                        }}
                      />
                    </Flex>
                    
                    <Flex justify="between" align="center">
                      <Text size="2">Challenge Updates</Text>
                      <Switch 
                        checked={preferences.challengeAlerts}
                        onCheckedChange={(checked) => {
                          if (user) updatePreferences(user.uid, { challengeAlerts: checked });
                        }}
                      />
                    </Flex>
                    
                    <Separator />
                    
                    <Flex justify="between" align="center">
                      <Box>
                        <Text weight="medium">Quiet Hours</Text>
                        <Text size="1" color="gray">No notifications during this time</Text>
                      </Box>
                      <Switch 
                        checked={preferences.quietHours.enabled}
                        onCheckedChange={(checked) => {
                          if (user) {
                            updatePreferences(user.uid, { 
                              quietHours: { ...preferences.quietHours, enabled: checked }
                            });
                          }
                        }}
                      />
                    </Flex>
                    
                    {preferences.quietHours.enabled && (
                      <Flex gap="2" align="center">
                        <Text size="2">From</Text>
                        <input 
                          type="time" 
                          value={preferences.quietHours.start}
                          onChange={(e) => {
                            if (user) {
                              updatePreferences(user.uid, {
                                quietHours: { ...preferences.quietHours, start: e.target.value }
                              });
                            }
                          }}
                          className="px-2 py-1 border rounded"
                        />
                        <Text size="2">to</Text>
                        <input 
                          type="time" 
                          value={preferences.quietHours.end}
                          onChange={(e) => {
                            if (user) {
                              updatePreferences(user.uid, {
                                quietHours: { ...preferences.quietHours, end: e.target.value }
                              });
                            }
                          }}
                          className="px-2 py-1 border rounded"
                        />
                      </Flex>
                    )}
                  </Flex>
                </Card>
              </Box>
            ) : (
              /* Notifications List */
              <Box className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <Card className="text-center py-9">
                    <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Text color="gray">No notifications yet</Text>
                    <Text size="2" color="gray" mt="2">
                      We'll notify you about important updates
                    </Text>
                  </Card>
                ) : (
                  <ScrollArea>
                    {Object.entries(groupedNotifications).map(([date, notifs]) => (
                      <Box key={date} mb="4">
                        <Text size="2" color="gray" weight="medium" mb="2">
                          {date === new Date().toDateString() ? 'Today' : 
                           date === new Date(Date.now() - 86400000).toDateString() ? 'Yesterday' : 
                           date}
                        </Text>
                        
                        <Flex direction="column" gap="2">
                          {notifs.map(notification => (
                            <Card
                              key={notification.id}
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                !notification.read ? 'bg-blue-50 border-blue-200' : ''
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <Flex gap="3">
                                <Box className="flex-shrink-0">
                                  {notification.icon ? (
                                    <Text size="5">{notification.icon}</Text>
                                  ) : (
                                    getNotificationIcon(notification.type)
                                  )}
                                </Box>
                                
                                <Box className="flex-1">
                                  <Flex justify="between" align="start" mb="1">
                                    <Text weight="medium">{notification.title}</Text>
                                    <Flex gap="2" align="center">
                                      <Badge 
                                        size="1" 
                                        color={getNotificationColor(notification.priority)}
                                        variant="soft"
                                      >
                                        {notification.priority}
                                      </Badge>
                                      <IconButton
                                        size="1"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(notification.id);
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </IconButton>
                                    </Flex>
                                  </Flex>
                                  
                                  <Text size="2" color="gray">{notification.message}</Text>
                                  
                                  {notification.actionLabel && (
                                    <Button size="1" variant="ghost" mt="2">
                                      {notification.actionLabel}
                                      <ChevronRight className="h-3 w-3 ml-1" />
                                    </Button>
                                  )}
                                  
                                  <Text size="1" color="gray" mt="1">
                                    {new Date(notification.createdAt).toLocaleTimeString()}
                                  </Text>
                                </Box>
                              </Flex>
                            </Card>
                          ))}
                        </Flex>
                      </Box>
                    ))}
                  </ScrollArea>
                )}
                
                {notifications.length > 0 && (
                  <Box mt="4">
                    <Button 
                      size="2" 
                      variant="soft" 
                      color="red"
                      onClick={() => {
                        if (user) clearAllNotifications(user.uid);
                      }}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All Notifications
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}