# node_project

The server would start at default port 8082 if run on localhost
Vapid Keys from Web Push library is used to subscribe for FCM notification

A working example can be found at https://push_notification.cfapps.io/?user=riya . Here the user parameter is used to identify that no single user receives more than one specific notification if subscribed accross various  browser at the same time .Notification will be sent only to the last used browser in this case. The request contains multipart request hence is a POST request

To send a common push notification to everyone https://push_notification.cfapps.io/notify/all is used.
