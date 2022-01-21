---
title: Animated Modals with Framer Motion
lastmod: 2021-09-12T15:20:52-07:00
publishdate: 2021-09-12T15:20:52-07:00
author: Jeff Delaney
draft: false
description: Build an animated modal with Framer Motion and React
tags: 
    - react
    - animation

youtube: SuqU904ZHA4
github: https://github.com/fireship-io/framer-demo
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

[Framer Motion](https://www.framer.com/motion/) is a React library for adding declarative animations to your components. It provides a variety of components that wrap plain HTML elements to extend them with animation superpowers 🦸. In this lesson, we will build a modal with Framer Motion with a variety of different animations styles. 

🚀 Try out the [live demo](https://react-framer-demo.netlify.app/)

## Setup

### Installation

Create a new React project

{{< file "terminal" "command line" >}}
```bash
$ npx create-react-app framer-demo
```

Open your new React app

```sh
$ cd react-framer-demo
```

Install the Framer Motion package

```sh
$ npm i framer-motion
```

## Animated Modal

### Trigger Button

Create a button that can when clicked will open a modal. Define a stateful value `modalOpen` to keep track of the open/close state. In this example, we use the `motion.div` component also animate the button itself.

{{< file "react" "App.js" >}}
```jsx
function App() {
  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="save-button"
        onClick={() => (modalOpen ? close() : open())}
      >
        Launch modal
      </motion.button>
    </div>
  )
}
```

### Backdrop

Create a component to serve as the backdrop for the modal. This component will be a `motion.div` component that fades in and out. It takes the `onClick` prop to close the modal when the backdrop is clicked.

{{< file "react" "components/Backdrop/index.js" >}}
```jsx
import { motion } from "framer-motion";

const Backdrop = ({ children, onClick }) => {
 
  return (
    <motion.div
      onClick={onClick}
      className="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
```

### Modal Window

The modal component uses the `Backdrop`, then has its own `motion.div` component that animates in and out. The animation states are defined in the `dropIn` object. Framer will transition from one state to the other when it is mounted in the DOM.

Also notice how [stopPropagation](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) is called when the modal is clicked - this prevents it from closing when the modal is clicked.

{{< file "react" "components/Modal/index.js" >}}
```jsx
import { motion } from "framer-motion";
import Backdrop from "../Backdrop";

const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };
  

const Modal = ({ handleClose, text }) => {

    return (
      <Backdrop onClick={handleClose}>
          <motion.div
            onClick={(e) => e.stopPropagation()}  
            className="modal orange-gradient"
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <p>{text}</p>
            <button onClick={handleClose}>Close</button>
          </motion.div>
      </Backdrop>
    );
  };

  
  export default Modal;
```

### Animate Presence

Framer Motion has a built in [AnimatePresence](https://www.framer.com/docs/animate-presence/) component that can handle animations for components that get added/removed from the DOM - we need it to animate the removal of a modal component.

{{< file "react" "App.js" >}}
```jsx
<AnimatePresence
    // Disable any initial animations on children that
    // are present when the component is first rendered
    initial={false}
    // Only render one component at a time.
    // The exiting component will finish its exit
    // animation before entering component is rendered
    exitBeforeEnter={true}
    // Fires when all exiting nodes have completed animating out
    onExitComplete={() => null}
>
    {modalOpen && <Modal modalOpen={modalOpen} handleClose={close} />}
</AnimatePresence>
```

## Extra Animations

The full demo provides a variety of animations to try out. Here are some of the animations found in the full source code. 

### Flip

Flip the modal in and out.

```jsx
const flip = {
  hidden: {
    transform: "scale(0) rotateX(-360deg)",
    opacity: 0,
    transition: {
      delay: 0.3,
    },
  },
  visible: {
    transform: " scale(1) rotateX(0deg)",
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    transform: "scale(0) rotateX(360deg)",
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};
```

### Newspaper

Extra, extra, read all about it!


```javascript
const newspaper = {
  hidden: {
    transform: "scale(0) rotate(720deg)",
    opacity: 0,
    transition: {
      delay: 0.3,
    },
  },
  visible: {
    transform: " scale(1) rotate(0deg)",
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    transform: "scale(0) rotate(-720deg)",
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};
```

### Bad Suspension

Make it look like something is broken, great for error messages. 

```javascript
const badSuspension = {
  hidden: {
    y: "-100vh",
    opacity: 0,
    transform: "scale(0) rotateX(-360deg)",
  },
  visible: {
    y: "-25vh",
    opacity: 1,
    transition: {
      duration: 0.2,
      type: "spring",
      damping: 15,
      stiffness: 500,
    },
  },
  exit: {
    y: "-100vh",
    opacity: 0,
  },
};
```

## Up Next

Check out the more advanced [Framer Motion Notification Feed tutorial](/lessons/framer-motion-advanced-notifications/).
