import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
  ) {}

  /**
   * Finds a country by name, or creates it if it doesn't exist.
   * @param name is required.
   * @returns a country entity that matches the provided name, either existing or newly created.
   */
  async findOrCreateByName(name: string): Promise<Country> {
    let country = await this.countriesRepository.findOne({
      where: { name },
    });

    if (!country) {
      country = this.countriesRepository.create({ name });
      await this.countriesRepository.save(country);
    }

    return country;
  }
}
