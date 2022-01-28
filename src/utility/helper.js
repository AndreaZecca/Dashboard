import { getSingleProduct, getSingleUser, getSingleEmployee } from './axios'

//Giving an array of rentals it returns an object containing an array of products/customers/employees and their relative frequencies
export async function statsByRentals(rentals){
    const productsStats = {}
    const employeesStats = {}
    const customersStats = {}

    for(const rental of rentals){
        if(!productsStats[rental.object_id])
            productsStats[rental.object_id] = 0
        productsStats[rental.object_id] += 1
        
        if(!customersStats[rental.userId])
            customersStats[rental.userId] = 0
        customersStats[rental.userId] += 1

        if(!employeesStats[rental.functionaryId])
            employeesStats[rental.functionaryId] = 0
        employeesStats[rental.functionaryId] += 1

    }
    const products = await Promise.all(Object.keys(productsStats).map(async x => (await getSingleProduct(x))))
    const productsFrequency = Object.values(productsStats)

    const customers = await Promise.all(Object.keys(customersStats).map(async x => (await getSingleUser(x))))
    const customersFrequency = Object.values(customersStats)

    const employees = await Promise.all(Object.keys(employeesStats).map(async x => (await getSingleEmployee(x))))
    const employeesFrequency = Object.values(employeesStats)

    return {
        productsStats: {
            products,
            productsFrequency
        },
        customersStats: {
            customers,
            customersFrequency
        },
        employeesStats: {
            employees,
            employeesFrequency
        }
    }
}

export function computeChartByObjField(args){
    const data = {}
    const { objs, frequency, field } = {...args}
    for(const obj of objs){
        if(!data[obj[field]])
            data[obj[field]] = 0
        data[obj[field]] += frequency ? frequency[objs.indexOf(obj)] : 1
    }

    let sorting = Object.keys(data).map(function(key) {
        return [key, data[key]];
    })
    
    sorting.sort(function(first, second) {
        if (second[1] < first[1]) return -1
        else if (second[1] > first[1]) return 1
        else return 0
    })

    return { labels: sorting.map(x=>x[0]), chartdata: sorting.map(x=>x[1]) }
}

export function computeChartByRentalPriceOrNumber(rentals, sumPrice){
    const price = {}
    for(const rental of rentals){
        if(!price[rental.date_start.slice(0,10)])
            price[rental.date_start.slice(0,10)] = 0

        if(!price[rental.date_end.slice(0,10)])
            price[rental.date_end.slice(0,10)] = 0
        
        price[rental.date_start.slice(0,10)] += sumPrice ? parseFloat(rental.estimated.price) : 1
        price[rental.date_end.slice(0,10)] += sumPrice ? parseFloat(rental.estimated.price) : 1
    }

    return { labels: Object.keys(price), chartdata: Object.values(price) }
}
