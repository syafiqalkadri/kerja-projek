const axios = require('axios');
const cheerio = require('cheerio');
const { client } = require("../database/db");





const scrap = async url => {
    return await axios.get(url)
    .then(({data}) => {
        const $ = cheerio.load(data);
        const doaKeseharian = $('h3')
        .map((_, product) => {
            const $product = $(product);
            return $product.text()
        })
        .toArray()
        const teksArab = $('p').map((_, hasil) => {
            const teksArab = $(hasil).filter((i,e) => {
                const style = $(e).attr('style');
                return style  == 'text-align: right;';
            })
            return teksArab.text()
        }).toArray().filter(e => e !== "");
        const latin = $('em').map((_, hasil) => {
            const latin  = $(hasil);
            return latin.text();
        }).toArray();
 
          const haschildStrong = $('p:has(strong)');
          const bahasaIndonesia =    haschildStrong.map((i,e) => {
           const result = $(e).text();
           return result;
         }).toArray().filter(e =>  e.includes('Artinya') && e !== 'Artinya: "Tidak ada sesuatu yang paling mulia di sisi Allah daripada doa." (Sunnan At-Timidzi, bab Doa 12/263).');

    


        return {
            doaKeseharian,
            teksArab,
            latin,
            bahasaIndonesia,
        }
    })
}



const getKomik = async (url) => {
    return await axios.get(url)
    .then(({data}) => {
        const $ = cheerio.load(data);
        const getKomik =$('#chimg-auh').find('img').each((i,e) => {
           const getImg= $(e).attr('src');
           return getImg;
        }).toArray()

        return {
            getKomik,
        };
    })
}





const hasil = async url => {
    return axios.get(url)
    .then(res => res.data)
    .catch(error => console.log(error));
}


async function getAudio(nomor) {
    let result = [];
    const {data} = await hasil(`https://equran.id/api/v2/surat/${nomor}`)
    const {ayat} = data;
    ayat.forEach(a => {
      const {audio} = a;
      const arr  = Object.values(audio);
       result.push(arr[0])
    })
     return result;
}







module.exports = {
    surah: async (req,res) => {
        const {data} = await hasil(`https://equran.id/api/v2/surat/`);
        const str = req.query.s || '';
        const can = str.toLowerCase() || str.toUpperCase();
        if (can) {
             let result = [];
            data.forEach(a => {
               if(a.namaLatin.toLowerCase().includes(can) || a.arti.toLowerCase().includes(can)) { 
                   result.push(a);    
               } 
                
            })
        }   
            let result = [];
            data.forEach(a => {
               if(a.namaLatin.toLowerCase().includes(can) || a.arti.toLowerCase().includes(can)) { 
                   result.push(a);    
               }
            })
    
    


           
    
  
        res.render('index', {
            data,
            can,
            result,
        })
    },

    Persurah:  async (req,res) => {
        const nomor = req.params.id;
        const getData = await getAudio(nomor);
        const {data} = await hasil(`https://equran.id/api/v2/surat/${nomor}`);
        const array = Object.values(data);
        const [a,b,c,d,e,f,g,h,i,j] = array;
        const arrayAudio = Object.values(h);
        const [audio] = arrayAudio;
         res.render('surah', {
            data,
            audio,
            b,
            c,
            i,
            j,
            nomor,
            getData,
         });
    },

    doaKeseharian : async (req,res) => {
        const {doaKeseharian, teksArab, latin, bahasaIndonesia} = await scrap('https://www.cnnindonesia.com/edukasi/20221104161238-569-869626/kumpulan-doa-sehari-hari-mudah-dihafal-dan-diamalkan');
        const [dontKnow, ...result] = teksArab;
        
        let Result = [];

        for(let i = 0; i < doaKeseharian.length; i++) {
            Result.push({
              id: `${i}`,
              doaKeseharian : doaKeseharian[i],
              teksarab: result[i],
              latin: latin[i],
              bahasaIndonesia: bahasaIndonesia[i],
            })
        }
    

       

    
        res.render('doaKeseharian', {
            Result,
        })
    },
    tafsir: async (req,res) => {
        const {data} = await hasil(`https://equran.id/api/v2/surat/`);
        const str = req.query.search || '';
        const can = str.toLowerCase() || str.toUpperCase();
    
    
        if (can) {
             let result = [];
            data.forEach(a => {
               if(a.namaLatin.toLowerCase().includes(can) || a.arti.toLowerCase().includes(can)) { 
                   result.push(a);    
               } 
               
            })
        }   
            let result = [];
            data.forEach(a => {
               if(a.namaLatin.toLowerCase().includes(can) || a.arti.toLowerCase().includes(can)) { 
                   result.push(a);    
               }
            })
    
            res.render('tafsirIndex', {
                data,
                can,
                result,
            })
    },

    Pertafsir: async (req, res) => {
        const angka = req.params.id;
        const Hasil = await hasil(`https://equran.id/api/v2/tafsir/${angka}`); 
        const {data} = Hasil;
        const {tafsir, nama, namaLatin, nomor, jumlahAyat} = data;
    
        res.render('tafsir', {
            tafsir,
            nama,
            namaLatin,
            nomor,
            jumlahAyat,
        })
    
    },



    postSurah: async (req,res) => {

        const {nama,description,email} = req.body;
                          await client.db("admin").command({ ping: 1 });
                           const db = client.db('DATABASEKP');
                           const feedback = db.collection('FEEDBACK');
                          if (nama == "" && description == "" && email == "" || nama && description == "" && email == "" || nama == "" && description && email == "" || email && nama == "" && feedback == "") {
                            res.render("dataKosong", {
                                url: "/surah",
                                str: "Surah",
                            })

                          } else {
                              await feedback.insertOne({nama,description,email});     
                              res.redirect('/surah')
      
                          }
      },

      postTafsir: async (req,res) => {
        const {nama,description,email} = req.body;
            await client.db("admin").command({ ping: 1 });
             const db = client.db('DATABASEKP');
             const feedback = db.collection('FEEDBACK');
            if (nama == "" && description == "" && email == "" || nama && description == "" && email == "" || nama == "" && description && email == "" || email && nama == "" && description == "") {
                 console.log('datanya kosong atau salah satunya ada yang kosong');
                 res.render("dataKosong", {
                    url: "/tafsir",
                    str: "Tafsir"
                 })
               
            } else {
                await feedback.insertOne({nama,description,email});
                res.redirect('/surah')
            }  
    },

}