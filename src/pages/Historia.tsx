import React from 'react';
import PageLayout from '@/components/layout/PageLayout';

const Historia: React.FC = () => {
  return (
    <PageLayout className="flex items-center justify-center px-24 py-48">
      <div className="max-w-3xl space-y-8">
        <h2 className="text-3xl font-bold mb-8">A História da Umbanda: Uma Religião Brasileira de Muitas Raízes</h2>
        
        <p className="text-lg leading-relaxed">
          A Umbanda é uma religião tipicamente brasileira, conhecida por sua riqueza espiritual e cultural. 
          Sua história é marcada por uma mistura de influências africanas, indígenas e europeias, que se 
          fundiram ao longo do tempo para criar uma prática religiosa única. Mas quando e como a Umbanda 
          surgiu? Essa é uma questão que gera muitos debates entre estudiosos e praticantes.
        </p>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold">O Marco de 1908: O Caboclo das Sete Encruzilhadas</h3>
          <p className="text-lg leading-relaxed">
            A história mais conhecida sobre o surgimento da Umbanda começa em 1908, no Rio de Janeiro. 
            Zélio de Moraes, um jovem de 17 anos, teria sido curado de uma doença misteriosa durante uma 
            sessão espírita. Nessa ocasião, ele incorporou o Caboclo das Sete Encruzilhadas, um espírito 
            que anunciou a criação de uma nova religião. Essa religião, chamada Umbanda, acolheria espíritos 
            de negros e indígenas, que eram marginalizados no espiritismo kardecista da época. O Caboclo 
            teria dito que a Umbanda seria baseada na caridade, no Evangelho Cristão e no respeito a todas 
            as entidades. Esse evento é considerado por muitos como o "nascimento" da Umbanda (Ortiz, 1999; 
            Giumbelli, 2002).
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Umbanda Branca: A Influência do Kardecismo</h3>
          <p className="text-lg leading-relaxed">
            No início do século XX, a Umbanda começou a se organizar, especialmente entre a classe média 
            urbana do Rio de Janeiro. Influenciados pelo espiritismo kardecista, esses praticantes buscaram 
            "embranquecer" a religião, distanciando-a de práticas consideradas "primitivas", como as macumbas 
            e os candomblés. Eles criaram uma versão mais "purificada" da Umbanda, com rituais mais simples 
            e uma estrutura organizada, semelhante ao kardecismo. Essa vertente, conhecida como Umbanda branca, 
            ganhou força durante o governo de Getúlio Vargas, quando houve uma perseguição aos cultos 
            afro-brasileiros. Para se legitimar, os umbandistas brancos se alinharam aos valores nacionalistas 
            e cristãos da época (Oliveira, 2008; Ortiz, 1999).
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Raízes Mais Antigas: Os Calundus e a Influência Africana</h3>
          <p className="text-lg leading-relaxed">
            No entanto, a história da Umbanda não começa em 1908. Muito antes disso, já existiam no Brasil 
            práticas religiosas sincréticas que misturavam elementos africanos, indígenas e europeus. Um exemplo 
            é o calundu de Luzia Pinta, uma sacerdotisa angolana que organizou um culto em Minas Gerais no 
            século XVIII. Seus rituais incluíam música, dança, cura e a incorporação de entidades, características 
            que hoje são associadas à Umbanda. Isso mostra que a Umbanda tem raízes muito mais antigas e 
            profundas do que o marco de 1908 sugere (Mott, 1994; Silveira, 2006).
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold">A Diversidade da Umbanda: Além da Umbanda Branca</h3>
          <p className="text-lg leading-relaxed">
            A Umbanda não se limita à vertente "branca" ou "pura". Ao longo do tempo, outras práticas foram 
            incorporadas ao seu universo, como a quimbanda, que trabalha com exus e pombagiras, entidades 
            antes consideradas "das trevas". Hoje, essas entidades são parte integrante da Umbanda, formando 
            a chamada "linha de esquerda". Além disso, outras tradições, como a jurema e o catimbó, também 
            se mesclaram à Umbanda, criando um panorama religioso diverso e plural (Saraceni, 2002; Rivas 
            Neto, 1996).
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Conclusão: Uma Religião em Construção</h3>
          <p className="text-lg leading-relaxed">
            A Umbanda é, portanto, o resultado de um longo processo de transformação cultural e espiritual. 
            Sua história não pode ser reduzida a um único momento ou grupo, mas deve ser entendida como uma 
            rede de influências e práticas que se desenvolveram ao longo do tempo. Desde os calundus coloniais 
            até a institucionalização no século XX, a Umbanda continua a evoluir, mantendo viva a riqueza de 
            suas raízes africanas, indígenas e europeias.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-black/10">
          <h4 className="text-xl font-bold mb-4">Referências:</h4>
          <ul className="space-y-2 text-sm">
            <li>Giumbelli, E. (2002). "Zélio de Moraes e as origens da umbanda no Rio de Janeiro".</li>
            <li>Mott, L. (1994). "O calundu-angola de Luzia Pinta: Sabará, 1739".</li>
            <li>Oliveira, J. H. M. (2008). Das macumbas à umbanda: uma análise histórica da construção de uma religião brasileira.</li>
            <li>Ortiz, R. (1999). A morte branca do feiticeiro negro: Umbanda e sociedade brasileira.</li>
            <li>Saraceni, R. (2002). Umbanda sagrada: religião, ciência, magia e mistérios.</li>
            <li>Silveira, R. (2006). O candomblé da Barroquinha: processo de constituição do primeiro terreiro baiano de keto.</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default Historia;
