import BenefitsCard from "../../BenefitsCard";
const Benefits = () => {
  return (
    <section className="flex flex-col gap-8 pt-10 pb-20">
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl font-bold text-center">Why Jobfi?</h2>
        <h4 className="text-lg text-center dark:text-white/40">
          Jobfi finds the best jobs for you. Set your filters and get notified
          instantly.
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <BenefitsCard
          description="Get notified the moment a matching job is posted."
          title="Instant"
        />
        <BenefitsCard
          description="Skip the junk and see only the roles you actually want."
          title="Relevant"
        />
        <BenefitsCard
          description="We search for you 24/7 so you never miss an opening."
          title="Always Active"
        />
        <BenefitsCard
          description="Manage your whole search from one easy-to-use place."
          title="Simple"
        />
      </div>
    </section>
  );
};

export default Benefits;
