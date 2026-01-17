import { Link } from "@heroui/link"
export default function Footer() {
  return (
    <section className="flex flex-col my-8">
        <div className="mb-8 h-0.5 bg-gradient-to-r dark:from-black dark:via-white/40 dark:to-black from-white via-black/20 to-white" />
        <div className='flex flex-row justify-between mx-80'>
            <div className='flex flex-col gap-5'>
                <h2 className='w-fit text-2xl font-bold bg-gradient-to-r dark:from-white dark:to-gray-900 from-gray-900 to-white bg-clip-text text-transparent pr-8'>Jobfi</h2>
                <div>
                    <h4 className='font-xl font-semibold opacity-60'>Your career deserves more than a scroll.</h4>
                    <h4 className='font-xl font-semibold opacity-60'>Let's turn alerts into opportunities.</h4>
                </div>
                <div className="flex">
                    <h4 className="font-xl font-semibold opacity-60">Created by&nbsp;</h4>
                    <h4 className="font-xl font-semibold">N1KO</h4>
                </div>
            </div>
            <div className="flex gap-16">
                <div className="flex flex-col gap-1">
                    <h4>Navigation</h4>
                    <Link className="opacity-60" color="foreground" href="/">Home</Link>
                    <Link className="opacity-60" color="foreground" href="/offers">Offers</Link>
                    <Link className="opacity-60" color="foreground" href="/login">Login</Link>
                    <Link className="opacity-60" color="foreground" href="/register">Register</Link>
                </div>
                <div className="flex flex-col gap-1">
                    <h4>Socials</h4>
                    <Link className="opacity-60" color="foreground" href="https://www.instagram.com/">Instagram</Link>
                    <Link className="opacity-60" color="foreground" href="https://www.facebook.com/">Facebook</Link>
                    <Link className="opacity-60" color="foreground" href="https://www.tiktok.com/">Tiktok</Link>
                </div>
            </div>

        </div>
    </section>
  )
}
