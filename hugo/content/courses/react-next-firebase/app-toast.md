{{< file "terminal" "command line" >}}
```bash
npm i react-hot-toast
```

{{< file "js" "pages/_app.js" >}}
```javascript
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
```

{{< file "js" "pages/index.js" >}}
```javascript
import toast from 'react-hot-toast';

export default function Home() {
  return (
    <div>
      <button onClick={() => toast.success('hello toast!')}>
        Toast Me
      </button>
    </div>
  );
}
```