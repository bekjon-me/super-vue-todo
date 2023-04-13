import Image1 from './1-You-Are-Awesome-Motivation-Meme.jpg'
import Image2 from './1462603171-Funny-Motivational-Quotes-9.webp'
import Image3 from './61MB+i24hcL._UF1000,1000_QL80_.jpg'
import Image4 from './636873962-funny-cute-pictures-never-give-up-quote-motivational-quotes-pics.webp'
import Image5 from './depositphotos_51474565-stock-illustration-doubts-kill-more-dreams-than.jpg'
import Image6 from './funny-motivational-quotes_01 (1).jpg'
import Image7 from './funny-motivational-quotes_01.jpg'
import Image8 from './screen-0.webp'

const randomImage = () => {
  const images = [Image1, Image2, Image3, Image4, Image5, Image6, Image7, Image8]
  return images[Math.floor(Math.random() * images.length)]
}

export default randomImage
