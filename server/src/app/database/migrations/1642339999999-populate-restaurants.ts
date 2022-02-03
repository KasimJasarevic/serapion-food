import { MigrationInterface, QueryRunner } from 'typeorm';

export class populateRestaurants1642339999999 implements MigrationInterface {
  name = 'populateRestaurants1642339999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Sezam (bez ćoška)', '035 257 123', null)`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Mozaik', '035 257 111', 'https://www.facebook.com/pizzeriamozaik/')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Old Story', '061 608 605', 'https://www.oldstory.ba/en/')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Zmaj od Bosne (špico)', '063 439 829', 'https://glovoapp.com/ba/hr/tuzla/dragon-from-bosnia-tzl/#735868721')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Pekara', null , null)`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Bingo', null , null)`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Sarajka', null , null)`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Čudesa od mesa', '062 393 206' , null)`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Zlatnik', '035 261 225' , null)`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Bagi', '061 755 418' , null)`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Snogu', '060 33 33 493' , null)`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Nota bene', '061 063 062' , 'https://korpa.ba/partner/nota-bene-pizzeria')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Barok', '062 775 441' , 'https://www.pizzeriabarok.com/')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Pizza bar', '062 313 100' , 'http://www.tanjir.ba/tuzla/-pizza-bar')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Casper', '062 174 300' , 'https://www.casperkebab.com/en/')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Pizza Trkačica', '062 400 004' , 'http://trkacica.com/')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Sezam (Sa ćoškom)', '062 860 105' , 'https://www.korpa.ba/partner/citta-del-sale')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Autor', '061 133 188' , 'http://www.tanjir.ba/tuzla/pizzeria-autor')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Retro pub', '061 151 661' , 'https://www.facebook.com/2581227108576999/posts/2725443397488702/')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Tušanj', '035 298-008' , null)`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Pegaz', '035 205 083' , 'https://www.facebook.com/pegazpekara/photos/a.106803920847464/106803774180812')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Šećo', '061 888 111' , 'https://www.facebook.com/secotuzla/')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Restoran Kuća', '062 278 888' , 'https://scontent.fsjj2-1.fna.fbcdn.net/v/t1.0-9/79388087_109722230521269_6049682867749912576_n.jpg?_nc_cat=101\u0026_nc_ohc=NLLtEUg-_FkAQm_ZDKqArE3uF-bVfS3IYIHRbbL3Q8QizkjrVwm_EA0aA\u0026_nc_ht=scontent.fsjj2-1.fna\u0026oh=6a1dc4babb65411a00ea34e6b729404b\u0026oe=5E678F09')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Sedra', '035 280 900' , 'https://sedra.ba/jelovnik/')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Limenka', null , null)`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('HotSpot', '061 507 107' , 'https://www.google.com/maps/uv?hl=en\u0026pb=!1s0x475ead30473ca58f%3A0xf0570fae0a376dc4!3m1!7e115!4shttps%3A%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNSzDh5CIIC3SSwaSEJxL_cLyt3a5BFjUYQBwL8%3Dw127-h160-k-no!5shotspot%20tuzla%20-%20Google%20Search!15sCgIYIQ\u0026imagekey=!1e10!2sAF1QipMbHKNfEnPI8QsgC0_iiScGmbbq4AQurGLGwBg\u0026sa=X\u0026ved=2ahUKEwj8_tKym_npAhVSi8MKHSfeDyEQoiowCnoECBgQBg')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Pizza Darkwood', '061 309 609' , 'https://www.tanjir.ba/tuzla/pizza-darkwood')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Ali Baba', '035 205 204' , 'https://scontent.fsjj2-1.fna.fbcdn.net/v/t39.30808-6/263849780_292830166089097_1137410530412140523_n.jpg?_nc_cat=110\u0026_nc_rgb565=1\u0026ccb=1-5\u0026_nc_sid=c4c01c\u0026_nc_ohc=0yd1cjQ2O58AX_xlaDw\u0026_nc_ht=scontent.fsjj2-1.fna\u0026oh=0c0c3e7c405dfe0de6914b8b2342f042\u0026oe=61B69719')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Fresh', null, 'https://korpa.ba/partner/ur-mlijecni-restoran-fresh')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Pizza Cut', null , 'https://korpa.ba/partner/pizza-cut')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Chick King', null , 'https://korpa.ba/partner/chick-king')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Aljina kafana', null , 'https://korpa.ba/partner/aljina-kafana')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Fast food pazar', null , 'https://korpa.ba/partner/fast-food-pazar')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Donerhana', null , 'https://korpa.ba/partner/donerhana')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Pekara pite 8', '062 311 003' , 'https://www.korpa.ba/partner/pekara-pite-8')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('AHA', null , 'https://www.korpa.ba/partner/fast-food-a-ha')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Česma', null , 'https://www.korpa.ba/partner/carsijska-cesma')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Pizza Garden', null, 'https://www.korpa.ba/partner/pizza-garden')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Zdravljak Bosna', null, 'https://korpa.ba/partner/zdravljak-bosna')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Choco loco', null, 'https://korpa.ba/partner/choco-loco')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Složna braća', '060 346 9282' , 'https://www.instagram.com/sloznabraca_2/')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Old Story Kebab house', null , 'https://www.korpa.ba/partner/old-story-kebab-house')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Restoran Saranda', null , 'https://www.korpa.ba/partner/restoran-saranda')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Mama Mia Omega', null , 'https://www.korpa.ba/partner/mama-mia-omega')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Snack Bar Garden - Hotel Tuzla', '035 277 077' , 'https://korpa.ba/partner/snack-bar-garden')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('House of Taste', null , 'https://korpa.ba/partner/house-of-taste')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('POPS Caffe Food', null , 'https://korpa.ba/partner/pops-caffee-food-tuzla')`);
    await queryRunner.query(`INSERT INTO restaurant (name, phone_number, menu) VALUES ('Grolle', null , 'https://korpa.ba/partner/cevabdzinica-grolle')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
