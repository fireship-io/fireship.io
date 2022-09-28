---
title: Animated Notifications with Framer Motion
lastmod: 2021-09-12T16:17:44-07:00
publishdate: 2021-09-12T16:17:44-07:00
author: Jeff Delaney
draft: false
description: An advanced tutorial using Framer Motion to create animated notifications.
tags: 
    - pro
    - react
    - animation

pro: true
vimeo: 604847278
github: https://github.com/fireship-io/framer-demo
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Learn advanced Framer Motion techniques by creating an animated notification feed from scratch. We dive into concepts like transitions, spring animations, SVGs, and drag gestures to create *dismissible* notifications.

⚠️ This is the sequel to the [Framer Motion Basics Tutorial](/lessons/framer-motion-modal). Make sure to watch that one first!

🚀 Try out the [live demo](https://react-framer-demo.netlify.app/)

## Notification

### Basic Notification

Start by creating a basic animated notification using a `motion.li` component. Feel free to experiment with the `notificationVariants` object to customize the animation result. 

{{< file "react" "components/Notification/index.js" >}}
```javascript
import { motion } from "framer-motion";

const notificationVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.2,
    transition: { duration: 0.1 },
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.2,
    transition: { ease: "easeOut", duration: 0.15 },
  },
  hover: { scale: 1.05, transition: { duration: 0.1 } },
};

const Notification = ({ notifications, setNotifications, notification }) => {
  const { text, style } = notification;

  return (
    <motion.li
      positionTransition
      style={styleType()} // Change the style based on style selection
      variants={notificationVariants} // Defined animation states
      whileHover="hover" // Animation on hover gesture
      initial="initial" // Starting animation
      animate="animate" // Values to animate to
      exit="exit" // Target to animate to when removed from the tree
    >
      <h3 style={{ color: style ? "#030303" : "#929292" }} className="notification-text">
        {text}
      </h3>
    </motion.li>
  );
};


export default Notification;
```

### Dynamic Colors

Create a function to dynamically control the color of the gradient based on the style selection.

```jsx
  const styleType = () => {
    // Controlled by selection menu
    switch (style) {
      case "success":
        return { background: "linear-gradient(15deg, #6adb00, #04e800)" };
      case "error":
        return { background: "linear-gradient(15deg, #ff596d, #d72c2c)" };
      case "warning":
        return { background: "linear-gradient(15deg, #ffac37, #ff9238)" };
      case "light":
        return { background: "linear-gradient(15deg, #e7e7e7, #f4f4f4)" };
      default:
        return { background: "linear-gradient(15deg, #202121, #292a2d)" };
    }
  };

```


## Managing Notifications

### Add/Remove from Array

A dedicated file is created for managing the addition/removal of notifications. This makes it easier to splice out notifications from the array.

{{< file "js" "arr-utils.js" >}}
```javascript
// MacGuyver'd utility to generate && remove notifications
export const remove = (arr, item) => {
  const newArr = [...arr];
  newArr.splice(
    newArr.findIndex((i) => i === item),
    1
  );
  return newArr;
};

let newIndex = 0;
export const add = (arr, text, style) => {
  newIndex = newIndex + 1;
  return [...arr, { id: newIndex, text: text, style: style }];
};

```

### SVG Close Button

Create an SVG close button to dismiss notifications when clicked. 

```jsx
const Notification = ({ notifications, setNotifications, notification }) => {
  const { text, style } = notification;

    const handleClose = () => setNotifications(remove(notifications, notification));

    return (
      <motion.li>
        <CloseButton handleClose={handleClose} />
      </motion.li>
  );
};


const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke={props.color}
    strokeLinecap="square"
    {...props}
  />
);

const CloseButton = ({ handleClose, color }) => (
  <motion.div whileHover={{ scale: 1.2 }} onClick={handleClose} className="close">
    <svg width="18" height="18" viewBox="0 0 23 23">
      <Path color={color} d="M 3 16.5 L 17 2.5" />
      <Path color={color} d="M 3 2.5 L 17 16.346" />
    </svg>
  </motion.div>
);
```

### Show Notifications

In the App component, create (1) a container for the notifications and (2) a button that adds notifications to the state when clicked.

{{< file "react" "App.js" >}}
```jsx
function App() {

  // Notifications state
  const [notifications, setNotifications] = useState([]);

  return (<>

      <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="add-button"
          onClick={() => setNotifications(add(notifications, text, style))}
      >
          + Stack em up
      </motion.button>

      <NotificationContainer position={position}>
        {notifications &&
          notifications.map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          ))}
      </NotificationContainer>
  </>);



  const NotificationContainer = ({ children, position }) => {
  return (
    <div className="container">
      <ul className={position}>
        <AnimatePresence
          initial={false}
          onExitComplete={() => framerLogger("Notifications container")}
        >
          {children}
        </AnimatePresence>
      </ul>
    </div>
  );
};
```

## Drag Gestures

### Drag Customization

Framer makes [drag gestures](https://www.framer.com/docs/gestures/) easy to work with with. Simply add the `drag` prop to the component to make it draggable. Make it snap back into place with `dragConstraints`. Or change the animation timing with `dragTransition`.

When dragging is complete, it will fire a `onDragEnd` event.

```jsx
const Notification = ({ notifications, setNotifications, notification }) => {

  const closeOnDrag = (event, info) => {
      // TODO
  }

  return (
    <motion.li
      positionTransition
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
      onDragEnd={closeOnDrag}
    >

    </motion.li>
  );
};
```

### Dismiss on Drag

Finally,  define the closeOnDrag function. This function is called when the user finishes dragging the notification. If the velocity is towards the right, the notification will be dismissed.


```jsx
const closeOnDrag = (event, info) => {
    console.log(info)
    if (info.velocity.x > 0) {
      handleClose();
    }
}
```