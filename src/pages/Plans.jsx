import PlanCard from '../components/PlanCard';

export default function Plans()
{
    
    return (
        <div className='bg-slate-200 flex flex-col items-center h-full p-8'>
            <div className='flex flex-col gap-4 lg:flex-row lg:h-3/5 w-4/5'>
                <PlanCard name='Basic' price='0.99' description='Good for those only interested in summaries for one topic.' features={['1 topic per month']} id={0}/>
                <PlanCard name='Standard' price='1.99' description='Great for those with a few key interests.' features={['5 topics per month']} id={1}/>
                <PlanCard name='Premium' price='4.99' description='Great for those with many interests and a lot of things to learn.' features={['Unlimited topics per month']} id={2}/>
            </div>
        </div>
    );
}