import { Body, Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseIntPipe, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { ConfigService } from '../config/config.service';
import { IsPositivePipe } from '../pipes/is-positive/is-positive.pipe';
import { ApiKeyGuard } from '../guards/api-key/api-key.guard';

@Controller('episodes')
export class EpisodesController {

    constructor(
        private episodeService: EpisodesService,
        private configService: ConfigService
    ) {}

    @Get()
    findAll(
        @Query('sort') sort: 'asc' | 'desc' = 'desc',
        @Query('limit', new DefaultValuePipe(100), ParseIntPipe, IsPositivePipe) limit: number
    ) {
        console.log("🚀 ~ EpisodesController ~ findAll ~ sort:", sort)
        return this.episodeService.findAll(sort)
    }

    @Get('featured')
    findFeatured() {
        return this.episodeService.findFeatured()
    }

    @Get(':id')
    async findOne(@Param() id: string) {
        console.log("🚀 ~ EpisodesController ~ findOne ~ id:", id)
        const episode = await this.episodeService.findOne(id)
        if (!episode) {
            throw new NotFoundException('Episode not found')
        }

        return episode
    }

    @UseGuards(ApiKeyGuard)
    @Post()
    create(@Body(ValidationPipe) input: CreateEpisodeDto) {
        console.log("🚀 ~ EpisodesController ~ create ~ input:", input)
        return this.episodeService.create(input)
    }
}
