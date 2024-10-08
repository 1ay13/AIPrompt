import Feed from "@components/Feed";

const Home = () => (
  <section className='w-full flex-center flex-col'>
    <h1 className='head_text text-center'>
      Discover & Share
      <br className='max-md:hidden' />
      <span className='orange_gradient text-center'> Witty Pick-Up Lines</span>
    </h1>
    <p className='desc text-center'>
      PickUpLines is your go-to source for fun and flirty lines to break the ice,
      spark a conversation, and share a laugh.
    </p>
    <Feed />
</section>

);

export default Home;