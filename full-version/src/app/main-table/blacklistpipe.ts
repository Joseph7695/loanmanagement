import { Pipe, PipeTransform } from "@angular/core";
import Customer from "app/models/customer";

@Pipe({ name: 'pluck' })
export class PluckPipe implements PipeTransform {
    transform(input: Customer[], key: number): any {
        return input.filter(value => {
            switch (key) {
                case 2:
                    return value.isBlacklist
                    break;
                case 3:
                    return !value.isBlacklist;
                    break;
                case 1:
                default:
                    return true
            }
        });
    }
}