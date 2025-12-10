import React from 'react'
import { Layout } from '../components/layout/Layout'
import { HeroSection } from '../components/home/HeroSection'
import { FeaturedBooks } from '../components/home/FeaturedBooks'
import { CategorySection } from '../components/home/CategorySection'
import { BestsellerSection } from '../components/home/BestsellerSection'
import { TestimonialSection } from '../components/home/TestimonialSection'

function index() {
  return (
    
      
   <Layout>
    <HeroSection/>
    <FeaturedBooks/>
    <CategorySection/>
    <BestsellerSection/>
    <TestimonialSection/>
   </Layout>
  )
}

export default index
