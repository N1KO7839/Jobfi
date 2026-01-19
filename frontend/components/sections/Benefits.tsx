import BenefitsCard from "../BenefitsCard"
const Benefits = () => {
  return (
    <section className="flex flex-col gap-8 pt-10 pb-15">
        <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-bold text-center">Why Jobfi?</h2>
            <h4 className="text-lg text-center text-white/40">Jobfi finds the best jobs for you. Set your filters and get notified instantly.</h4>
        </div>
        <div className="flex flex-row justify-evenly gap-5">
            <BenefitsCard title="Instant" description="Get notified the moment a matching job is posted."/>
            <BenefitsCard title="Relevant" description="Skip the junk and see only the roles you actually want."/>
            <BenefitsCard title="Always Active" description="We search for you 24/7 so you never miss an opening."/>
            <BenefitsCard title="Simple" description="Manage your whole search from one easy-to-use place."/>
        </div>
    </section>
  )
}

export default Benefits