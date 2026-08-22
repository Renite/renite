// import { describe, expect, it } from 'vitest';
// import { readFileSync } from 'node:fs';
// // import { resolve } from 'node:path';

// import { decodeFaydaPayload } from './faydaDecoder';

// // const vectorsPath = resolve(
// //   process.cwd(),
// //   'fayda-decoder',
// //   'testdata',
// //   'vectors.json'
// // );

// const vectors = JSON.parse(readFileSync(vectorsPath, 'utf8'));

// describe('Fayda synthetic decoder vectors', () => {
//   for (const [index, vector] of vectors.entries()) {
//     it(`decodes vector ${index + 1}`, () => {
//       const result = decodeFaydaPayload(vector.payload);

//       expect(result.ok).toBe(vector.expected.ok);

//       if (result.ok && vector.expected.fields) {
//         expect(result.fields.full_name).toBe(
//           vector.expected.fields.full_name
//         );

//         expect(result.fields.gender).toBe(
//           vector.expected.fields.gender
//         );

//         expect(result.fields.fan).toBe(
//           vector.expected.fields.fan
//         );

//         expect(result.fields.date_of_birth).toBe(
//           vector.expected.fields.date_of_birth
//         );
//       }
//     });
//   }
// });