import {subtitle, title} from "@/components/primitives";
import {Button} from "@heroui/button";


export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Find your next job without &nbsp;</span>
        <span className={title({ color: "violet" })}>spending hours&nbsp;</span> 
        <span className={title()}>on</span>
        <br />
        <span className={title()}>
          searching.
        </span>
      <div className={subtitle({ class: "mt-4" })}>
          Beautiful, fast and modern React UI library.
        </div>
      </div>
      <div className="flex flex-row gap-5">
          <Button size="lg" color="secondary" variant="shadow" >
              Get started with Jobfi
          </Button>
          <Button size="lg" color="default" variant="bordered">
              Learn more
          </Button>
      </div>
    </section>
  );
}
