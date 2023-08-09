import '../styles/globals.css'
import Layout from '../components/layout/Layout';

//This _app.js is the root file loaded by next.js and 
//App component is the root component that nextjs will render.
//It receives props that are using object de-structuring to pull out values.
//these props are made availbale to this component automatically by nextjs.
//Component is the actually page content that has to be rendered.
//So we will wrap this global Component with Layout, 
//so as to reflect the effect of Layout all over the website, 
//for all pages without needing to wrap in all index.js files for respective pages.

function MyApp({ Component, pageProps }) {
  return <Layout><Component {...pageProps} /></Layout>
}

export default MyApp
