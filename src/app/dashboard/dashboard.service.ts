import { Injectable } from '@nestjs/common';
import { DetailsDTO } from './dtos/details-dto';
import { CustomersService } from '../customers/customers.service';
import { ExpensesService } from '../expenses/expenses.service';
import { PayrollsService } from '../payrolls/payrolls.service';
import { ProductsService } from '../products/products.service';
import { Payrolls } from '@prisma/client';

export interface IDashboardService {
    getDetails(detailsDTO: DetailsDTO): Promise<any>
}

@Injectable()
export class DashboardService implements IDashboardService {
    constructor(
        private readonly customersService: CustomersService,
        private readonly expensesService: ExpensesService,
        private readonly payrollsService: PayrollsService,
        private readonly productsService: ProductsService
    ) { }

    async getDetails(detailsDTO: DetailsDTO): Promise<any> {
        const filteredCustomers = await this.customersService.getAll();
        const filteredExpenses = await this.expensesService.getRange(detailsDTO.startDate, detailsDTO.endDate);
        const filteredPayrolls = await this.payrollsService.getRange(detailsDTO.startDate, detailsDTO.endDate);
        const filteredProducts = await this.productsService.getRange(detailsDTO.startDate, detailsDTO.endDate);
        const annualBilling  = await this.getAnnualBilling();

        return {
            expenses: [
                ...filteredExpenses,
                {
                    name: "Salário",
                    description: "Valor total pago para os funcionários",
                    value: this.reducePayrolls(filteredPayrolls),
                    date: new Date(),
                }
            ],
            products: filteredProducts.map(product => {
                const customer = filteredCustomers.find(customer => 
                    customer.id == product.idCustomer);

                return {
                    date: product.completionDate,
                    description: product.description,
                    customer: customer?.name,
                    amount: product.amount,
                }
            }),
            annualBilling: annualBilling
        }
    }

    private reducePayrolls(payrolls: Payrolls[]) : number {
        if(payrolls.length > 0) {
            return payrolls.map(payroll => payroll.salaryToBePaid.toNumber())
                .reduce((previousValue, currentValue) => {
                    return previousValue + currentValue;
                });
        }

        return 0;
    }

    private async getAnnualBilling(): Promise<any> {
        const products = await this.productsService.getAll();
        const expenses = await this.expensesService.getAll();
        const payrolls = await this.payrollsService.getAll();

        var annualBilling: { [id: number] : number; } = {};
        var annualPayrolls: { [id: number] : any; } = {};

        for(var i = 0; i < 12; i++) {
            annualBilling[i] = 0;
            annualPayrolls[i] = 0;
        }

        products.forEach(product => {
            if(product.completionDate) {
                const date = new Date(product.completionDate);
                
                if(date.getFullYear() == new Date().getFullYear()) {
                    annualBilling[date.getMonth()] += product.amount.toNumber() ?? 0;
                }
            }
        });

        expenses.forEach(expense => {
            const date = new Date(expense.date);

            if(date.getFullYear() == new Date().getFullYear()){
                annualBilling[date.getMonth()] -= expense.value.toNumber() ?? 0;
            }
        });

        payrolls.forEach(payrolls => {
            const date = new Date(payrolls.date);

            if(date.getFullYear() == new Date().getFullYear()) {
                annualPayrolls[date.getMonth()] += payrolls.salaryToBePaid.toNumber() ?? 0;
            }
        })

        for(var i = 0; i < 12; i++) {
            annualBilling[i] -= annualPayrolls[i];
        }
        
        return annualBilling;
    }
}
