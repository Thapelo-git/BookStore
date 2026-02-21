import React from 'react'
import { Layout } from '../components/layout/Layout'


import { BookGrid } from '../components/home/CategorySection'
import { BestsellerSection } from '../components/home/BestsellerSection'


function index() {
  return (
    
      
   <Layout>
    
    
    <BookGrid/>
    <BestsellerSection/>
  
   </Layout>
  )
}

export default index
