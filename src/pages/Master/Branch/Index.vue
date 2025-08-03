<template>
  <div class="ma-6">
    <v-row>
      <v-col cols="12">
        <p class="font-24 font-weight-bold">
          {{ route.matched[2].meta.label }}
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import type { IDefaultParams } from '@/model/utils-interface';
import { list } from '@/service/Master/branch';
import { useLoadingComponent } from '@/utils/loading';

const route = useRoute();

// loading
const { loading, resultLoading } = useLoadingComponent();

// params
const stateParams = reactive<IDefaultParams>({
  search: '',
  order_field: null,
  order_dir: null,
  page: 1,
  per_page: 10,
});

const fetchData = async () => {
  loading.data = true;

  list(stateParams)
    .then(({ data }) => {
      console.log(data);
    })
    .finally(() => (loading.data = false));
};

fetchData();
</script>
