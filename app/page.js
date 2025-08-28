'use client'

import { useRouter } from 'next/navigation'

import styles from './page.module.css';

export default function Page() {

  const router = useRouter()

  return (
    <div>
      <h1>Welcome to BookApp</h1>


      <button type="button" className={styles.ctabutton} onClick={() => router.push('/Book')}>
        CLICK HERE FOR BOOK LIST
      </button>

    </div>
  );
}